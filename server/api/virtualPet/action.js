import { Visitor, World, DroppedAsset } from "../topiaInit.js";
import {
  isPetInWorld,
  canPerformAction,
  getVisitorWithDataObject,
} from "./utils.js";
import { logger } from "../../logs/logger.js";
import { level } from "./utils.js";
import { handleSpawnPet } from "./spawn.js";

const ACTION_COOLDOWNS = {
  PLAY: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 15,
  SLEEP: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 45,
  FEED: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 60 * 1,
  TRAIN: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 30,
};

const ACTION_EXPERIENCE_GAIN = {
  PLAY: 5,
  SLEEP: process.env.IS_LOCALHOST ? 200 : 15,
  FEED: process.env.IS_LOCALHOST ? 500 : 20,
  TRAIN: 10,
};

export const action = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
      parentAssetId,
    } = req?.query;

    const { action } = req?.body;

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = await getVisitorWithDataObject({ credentials, urlSlug });

    const pet = visitor?.dataObject?.pet;

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
        success: false,
      });
    }

    const currentTime = Date.now();

    let updatedPet;

    updatedPet = await performAction({
      req,
      res,
      visitor,
      pet,
      actionKey: action,
      now: currentTime,
    });

    if (!updatedPet) {
      return res.status(403).json({
        message: `Pet doesn't want to ${action} at the moment.`,
        success: false,
      });
    }

    updatedPet.isPetInWorld = await isPetInWorld(urlSlug, visitor, credentials);

    await executeParticleEffect({
      parentAssetId,
      assetId,
      urlSlug,
      credentials,
    });

    await visitor.updateDataObject({ pet: updatedPet });

    const hasEmoteUnlocked = await grantExpression({
      visitor,
      pet,
      newExperience: updatedPet.experience,
    });

    await respawnPet({
      req,
      pet,
      newExperience: updatedPet.experience,
      visitor,
    });

    return res.json({
      pet: updatedPet,
      success: true,
      emoteUnlocked: hasEmoteUnlocked,
    });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🏃‍♂️ Error while performing action with the Pet",
      functionName: "action",
      req,
    });
    return res.status(500).json({ error: error?.message, success: false });
  }
};

async function performAction({ req, res, visitor, pet, actionKey, now }) {
  const cooldown = ACTION_COOLDOWNS[actionKey];
  const experienceGain = ACTION_EXPERIENCE_GAIN[actionKey];

  if (!pet[actionKey]) {
    pet[actionKey] = {
      timestamp: 0,
      amount: 0,
    };
  }

  if (!canPerformAction(pet[actionKey].timestamp, now, cooldown)) {
    return false;
  }

  return {
    ...pet,
    experience: (pet.experience || 0) + experienceGain,
    [actionKey]: {
      ...pet[actionKey],
      timestamp: now,
      amount: (pet[actionKey].amount || 0) + 1,
    },
  };
}

async function grantExpression({ visitor, pet, newExperience }) {
  let hasEmoteUnlocked = false;
  if (
    newExperience >= level[5] &&
    (!pet.experience || pet.experience < level[5])
  ) {
    const expressionName = `pet_${pet?.petType}`;
    const grantExpressionResponse = await visitor.grantExpression({
      name: expressionName,
    });

    visitor
      .updateDataObject(
        {},
        {
          analytics: [
            {
              analyticName: `${expressionName}-emoteUnlocked`,
              uniqueKey: profileId,
            },
          ],
        }
      )
      .then()
      .catch(() => console.error("Error analytics when granting expressions"));

    let title = "🔎 New Emote Unlocked";
    let text = "🌟 Congratulations! You just unlocked a new emote!";
    hasEmoteUnlocked = true;

    if (grantExpressionResponse.data?.statusCode === 409) {
      title = `Congratulations! You've leveled up!`;
      text =
        "You've already collected this reward. Trade in your pet to start over and collect a new emote!";
      hasEmoteUnlocked = false;
    }

    await visitor.fireToast({
      groupId: "VirtualPetExpression",
      title,
      text,
    });
  }
  return hasEmoteUnlocked;
}

async function respawnPet({ req, pet, newExperience, visitor }) {
  const levels = [3, 8];

  for (const level of levels) {
    if (newExperience >= level && (!pet.experience || pet.experience < level)) {
      await handleSpawnPet(req);
      visitor
        .updateDataObject(
          {},
          {
            analytics: [
              {
                analyticName: `level${level + 2}Reached`,
                uniqueKey: profileId,
              },
            ],
          }
        )
        .then()
        .catch(() =>
          console.error("Error sending level up data for analytics")
        );
    }
  }
}

async function executeParticleEffect({
  parentAssetId,
  assetId,
  urlSlug,
  credentials,
}) {
  if (parentAssetId && !parentAssetId == "null") {
    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, {
      credentials,
    });

    const world = World.create(urlSlug, { credentials });

    await world.triggerParticle({
      name: process.env.PARTICLE_EFFECT_NAME_FOR_PET_ACTION || "Snow",
      duration: 3,
      position: {
        x: droppedAsset?.position?.x,
        y: droppedAsset?.position?.y,
      },
    });
  }
}
