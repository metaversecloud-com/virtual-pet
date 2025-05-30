import { Request, Response } from "express";
import {
  errorHandler,
  dropAsset,
  getCredentials,
  getVisitorAndPetStatus,
  grantExpression,
  performAction,
  triggerParticleEffects,
  getLevelAndAge,
} from "../utils/index.js";
import { levelUp } from "../utils/levelUp.js";

export const handleExecuteAction = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, profileId } = credentials;
    const { action, keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { petStatus, visitor } = await getVisitorAndPetStatus(credentials);

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
      petSpawnedDroppedAssetId: petStatus.petSpawnedDroppedAssetId,
      actionKey: action,
    })
      .then()
      .catch((error) => console.error(error));

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

    await grantExpression({
      profileId,
      visitor,
      petStatus,
      newExperience: updatedPetStatus.experience,
    });

    const didPetLevelUp = await levelUp({
      experience: petStatus.experience,
      newExperience: updatedPetStatus.experience,
      visitor,
    });
    if (didPetLevelUp) {
      await dropAsset({ credentials, petStatus, visitor, host: req.host });
    }

    const { currentLevel, experienceNeededForNextLevel, experienceNeededForTheLevelYouCurrentlyAchieved, petAge } =
      getLevelAndAge(updatedPetStatus.experience || 0);

    return res.json({
      isPetAssetOwner: true,
      isPetInWorld: true,
      petStatus: {
        ...updatedPetStatus,
        currentLevel,
        experienceNeededForNextLevel,
        experienceNeededForTheLevelYouCurrentlyAchieved,
        petAge,
      },
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
