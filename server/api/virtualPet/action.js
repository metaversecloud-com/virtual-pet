import { Visitor } from "../topiaInit.js";
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

    await visitor.updateDataObject({ pet: updatedPet });

    const hasEmoteUnlocked = await grantExpression({
      visitor,
      pet,
      newExperience: updatedPet.experience,
    });

    await respawnPet({ req, pet, newExperience: updatedPet.experience });

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
    const grantExpressionResponse = await visitor.grantExpression({
      name: `pet_${pet?.petType}`,
    });

    let title = "🌟 Congratulations! You just unlocked a new emote!";
    let text =
      "Check it out your new emote by clicking in your Topia character";
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

async function respawnPet({ req, pet, newExperience }) {
  if (
    (newExperience >= level[3] &&
      (!pet.experience || pet.experience < level[3])) ||
    (newExperience >= level[8] &&
      (!pet.experience || newExperience >= level[8]))
  ) {
    await handleSpawnPet(req);
  }
}
