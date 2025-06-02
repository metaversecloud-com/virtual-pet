import { Request, Response } from "express";
import {
  checkForLevelUp,
  errorHandler,
  dropAsset,
  getCredentials,
  getVisitorAndPetStatus,
  performAction,
  triggerParticleEffects,
  getLevelAndAge,
} from "../utils/index.js";

export const handleExecuteAction = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, profileId } = credentials;
    const { action, keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { petStatus, visitor } = await getVisitorAndPetStatus(credentials);
    const { currentLevel, petType, petSpawnedDroppedAssetId } = petStatus;

    const updatedPetStatus = await performAction({
      petStatus,
      actionKey: action,
    });

    if (!updatedPetStatus) {
      return res.status(403).json({
        message: `Pet doesn't want to ${action} at the moment.`,
        success: false,
      });
    }

    triggerParticleEffects({
      credentials,
      petSpawnedDroppedAssetId: petSpawnedDroppedAssetId,
      actionKey: action,
    })
      .then()
      .catch((error) => console.error(error));

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

    const didPetLevelUp = await checkForLevelUp({
      currentLevel,
      updatedLevel,
      visitor,
      petType,
    });
    if (didPetLevelUp) {
      await dropAsset({ credentials, petStatus: updatedPetStatus, visitor, host: req.host });
    }

    await visitor.updateDataObject(
      { pet: updatedPetStatus },
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

    return res.json({
      isPetAssetOwner: true,
      isPetInWorld: true,
      petStatus: updatedPetStatus,
      visitorHasPet: true,
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
