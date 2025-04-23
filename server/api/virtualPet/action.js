import { World, DroppedAsset } from "../topiaInit.js";
import { isPetInWorld, canPerformAction, getVisitorWithDataObject } from "./utils.js";
import { logger } from "../../logs/logger.js";
import { level } from "./utils.js";
import { handleSpawnPet } from "./spawn.js";
import { getCredentials } from "../../getCredentials.js";

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

const ACTION_PARTICLE_EFFECTS = {
  SLEEP: "sleep_float",
  PLAY: "guitar_float",
  FEED: "redHeart_float",
  TRAIN: "pawPrint_float",
};

export const action = async (req, res) => {
  try {
    const { action } = req?.body;

    const credentials = getCredentials(req.query);
    const { assetId, urlSlug, parentAssetId, profileId } = credentials;

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

    executeParticleEffect({
      visitor,
      parentAssetId,
      assetId,
      urlSlug,
      credentials,
      actionKey: action,
    })
      .then()
      .catch((error) => console.error(error));

    await visitor.updateDataObject(
      { [`pet`]: updatedPet },
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

    const hasEmoteUnlocked = await grantExpression({
      req,
      visitor,
      pet,
      newExperience: updatedPet.experience,
    });

    await levelUpHandler({
      req,
      pet,
      newExperience: updatedPet.experience,
      visitor,
      credentials,
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

async function performAction({ pet, actionKey, now }) {
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

async function grantExpression({ req, visitor, pet, newExperience }) {
  const { profileId } = req?.query;

  let hasEmoteUnlocked = false;
  if (newExperience >= level[5] && (!pet.experience || pet.experience < level[5])) {
    const expressionName = `pet_${pet?.petType}`;
    const grantExpressionResponse = await visitor.grantExpression({
      name: expressionName,
    });

    let title, text;

    if (grantExpressionResponse.status === 200) {
      title = "🔎 New Emote Unlocked";
      text = "🌟 Congratulations! You just unlocked a new emote!";
      hasEmoteUnlocked = true;
      visitor
        .triggerParticle({
          name: "whiteStar_burst",
          duration: 7,
        })
        .then()
        .catch((error) => JSON.stringify(error));

      visitor
        .updateDataObject(
          {},
          {
            analytics: [
              {
                analyticName: `${expressionName}-emoteUnlocked`,
                // uniqueKey: profileId,
                profileId,
              },
            ],
          },
        )
        .then()
        .catch(() => console.error("Error analytics when granting expressions"));
    } else {
      title = `🌟 Congratulations! You've leveled up!`;
      text = "You've already collected this reward. Trade in your pet to start over and collect a new emote!";
      hasEmoteUnlocked = false;
    }

    visitor
      .fireToast({
        groupId: "VirtualPetExpression",
        title,
        text,
      })
      .then()
      .catch();
  }
  return hasEmoteUnlocked;
}

async function levelUpHandler({ req, pet, newExperience, visitor }) {
  const levelsThatEvolvesPet = [3, 8];

  for (const levelThatEvolvesPet of levelsThatEvolvesPet) {
    if (
      newExperience >= level[levelThatEvolvesPet] &&
      (!pet.experience || pet.experience < level[levelThatEvolvesPet])
    ) {
      await handleSpawnPet(req);

      visitor
        .triggerParticle({
          name: "medal_float",
          duration: 7,
        })
        .then()
        .catch((error) => JSON.stringify(error));
    }
  }
}

async function executeParticleEffect({ visitor, parentAssetId, assetId, urlSlug, credentials, actionKey, option }) {
  const world = World.create(urlSlug, { credentials });
  let particleEffect = ACTION_PARTICLE_EFFECTS[actionKey];
  let duration = 3;

  if (option == "leveledUp") {
    particleEffect = "medal_float";
    duration = 7;
  } else if (option == "grantExpression") {
    particleEffect = "whiteStar_burst";
    duration = 7;
  }

  if (parentAssetId && parentAssetId != "null") {
    const droppedAsset = await DroppedAsset.get(assetId, urlSlug, { credentials });

    world
      .triggerParticle({
        name: particleEffect,
        duration,
        position: {
          x: droppedAsset?.position?.x,
          y: droppedAsset?.position?.y,
        },
      })
      .then()
      .catch((error) => JSON.stringify(error));
  } else if (visitor?.dataObject?.pet?.petSpawnedDroppedAssetId) {
    await visitor.fetchDataObject();
    const droppedAsset = await DroppedAsset.get(visitor?.dataObject?.pet?.petSpawnedDroppedAssetId, urlSlug, {
      credentials,
    });
    world
      .triggerParticle({
        name: particleEffect,
        duration,
        position: {
          x: droppedAsset?.position?.x,
          y: droppedAsset?.position?.y,
        },
      })
      .then()
      .catch((error) => JSON.stringify(error));
  }
}
