import { Request, Response } from "express";
import {
  checkForLevelUp,
  errorHandler,
  getCredentials,
  getVisitorAndPetStatus,
  performAction,
  getLevelAndAge,
  World,
  awardBadge,
  spawnPetNpc,
} from "../utils/index.js";
import { ACTION_PARTICLE_EFFECTS } from "../constants.js";

type ActionType = keyof typeof ACTION_PARTICLE_EFFECTS;

export const handleExecuteAction = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, profileId } = credentials;
    const { action, keyAssetId, selectedPetId }: { action: ActionType; keyAssetId?: string; selectedPetId?: string } =
      req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;
    if (!selectedPetId) throw new Error("No pet selected");

    const promises = [];

    const actionKey = action.toLowerCase() as keyof typeof updatedPetStatus;

    const { pets, visitor, visitorInventory, petVisitorPosition } = await getVisitorAndPetStatus(credentials);
    if (!pets) throw new Error("No pets status found for visitor");

    const petStatus = pets[selectedPetId];

    const { currentLevel, petType, lastInteractionDate, currentStreak = 0, longestStreak = 0 } = petStatus;

    const updatedPetStatus = await performAction({
      petStatus,
      actionKey,
    });

    if (!updatedPetStatus) {
      return res.status(403).json({
        message: `Pet doesn't want to ${actionKey} at the moment.`,
        success: false,
      });
    }

    const world = World.create(urlSlug, { credentials });
    promises.push(
      world
        .triggerParticle({
          name: ACTION_PARTICLE_EFFECTS[actionKey.toUpperCase() as ActionType],
          duration: 3,
          position: petVisitorPosition,
        })
        .catch((error) => console.error(error)),
    );

    const {
      currentLevel: updatedLevel,
      experienceNeededForNextLevel,
      experienceNeededForTheLevelYouCurrentlyAchieved,
      petAge,
    } = getLevelAndAge(updatedPetStatus.experience || 0);

    updatedPetStatus.currentLevel = updatedLevel;
    updatedPetStatus.experienceNeededForNextLevel = experienceNeededForNextLevel;
    updatedPetStatus.experienceNeededForTheLevelYouCurrentlyAchieved = experienceNeededForTheLevelYouCurrentlyAchieved;
    updatedPetStatus.petAge = petAge;
    updatedPetStatus.lastInteractionDate = new Date().toISOString();
    updatedPetStatus.currentStreak = currentStreak;
    updatedPetStatus.longestStreak = longestStreak;

    if (new Date().getDate() - new Date(lastInteractionDate as string).getDate() === 1) {
      updatedPetStatus.currentStreak = currentStreak + 1;
    }
    if (updatedPetStatus.currentStreak && updatedPetStatus.currentStreak > longestStreak) {
      updatedPetStatus.longestStreak = currentStreak;
    }

    const updatedPets = { ...pets, [selectedPetId]: updatedPetStatus };
    await visitor.updateDataObject(
      { pets: updatedPets },
      {
        analytics: [
          {
            analyticName: `interactions`,
            uniqueKey: profileId,
            urlSlug,
            profileId,
          },
        ],
      },
    );

    const didPetLevelUp = await checkForLevelUp({
      currentLevel,
      updatedLevel,
      visitor,
      petType,
    });

    if (didPetLevelUp) {
      // Award Growing up Fast badge for leveling up a pet to Teen
      if (updatedLevel < 10) {
        promises.push(
          awardBadge({
            credentials,
            visitor,
            visitorInventory,
            badgeName: "Growing up Fast",
          }).catch((error: any) =>
            errorHandler({
              error,
              functionName: "handleExecuteAction",
              message: "Error awarding Growing up Fast badge",
            }),
          ),
        );
      }

      // Award All Grown Up badge for leveling up a pet to Adult
      if (updatedLevel >= 10) {
        promises.push(
          awardBadge({
            credentials,
            visitor,
            visitorInventory,
            badgeName: "All Grown Up",
          }).catch((error: any) =>
            errorHandler({
              error,
              functionName: "handleExecuteAction",
              message: "Error awarding All Grown Up badge",
            }),
          ),
        );
      }

      await spawnPetNpc({
        credentials,
        visitor,
        visitorInventory,
        petStatus: updatedPetStatus,
      });
    }

    // Award Veteran Caretaker badge for leveling up to 15
    if (updatedLevel === 15) {
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Veteran Caretaker",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleExecuteAction",
            message: "Error awarding Veteran Caretaker badge",
          }),
        ),
      );
    }

    // Award Loyal Friend badge if pet was created over 30 days ago
    if (
      updatedPetStatus.createdDate &&
      new Date(updatedPetStatus.createdDate) <= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    ) {
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Loyal Friend",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleExecuteAction",
            message: "Error awarding Loyal Friend badge",
          }),
        ),
      );
    }

    // Award Consistent Care badge for maintaining a 7-day interaction streak
    if (updatedPetStatus.currentStreak === 7) {
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Consistent Care",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleExecuteAction",
            message: "Error awarding Consistent Care badge",
          }),
        ),
      );
    }

    // Award action count badge for taking the same action 15 times
    if (
      updatedPetStatus[actionKey] &&
      (updatedPetStatus[actionKey] as { actionTakenCount?: number }).actionTakenCount === 15
    ) {
      let badgeName = "";
      switch (action) {
        case "FEED":
          badgeName = "Well Fed";
          break;
        case "SLEEP":
          badgeName = "Well Rested";
          break;
        case "PLAY":
          badgeName = "Let's Play";
          break;
        case "TRAIN":
          badgeName = "Trainer in the Making";
          break;
      }
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName,
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleExecuteAction",
            message: `Error awarding ${badgeName} badge`,
          }),
        ),
      );
    }

    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === "rejected") console.error(result.reason);
    });

    return res.json({
      isPetOwner: true,
      petStatus: updatedPetStatus,
      pets: updatedPets,
      selectedPetId,
      visitorInventory,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleExecuteAction",
      message: "Error executing pet action",
      req,
      res,
    });
  }
};
