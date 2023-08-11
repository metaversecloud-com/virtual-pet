import { Visitor } from "../topiaInit.js";
import { isPetInWorld, canPerformAction } from "./utils.js";

const ACTION_COOLDOWNS = {
  PLAY: 1000 * 60 * 15,
  SLEEP: 1000 * 60 * 45,
  FEED: 1000 * 60 * 60 * 1,
  TRAIN: 1000 * 60 * 60 * 30,
};

const ACTION_EXPERIENCE_GAIN = {
  PLAY: 5,
  SLEEP: 15,
  FEED: 20,
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
    } = req.query;

    const { action } = req.body;
    if (
      !assetId ||
      !interactivePublicKey ||
      !interactiveNonce ||
      !urlSlug ||
      !visitorId
    ) {
      return res.status(400).json({
        message:
          "Missing required data in the request: 'assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId'",
        success: false,
      });
    }

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials,
    });

    await visitor.fetchDataObject();

    // await visitor.setDataObject({ pet: null });

    const pet = visitor?.dataObject?.pet;

    if (!pet) {
      return res.status(404).json({
        message: "Pet not found",
        success: false,
      });
    }

    const currentTime = Date.now();

    let updatedPet;
    try {
      updatedPet = performAction(pet, action, currentTime);
    } catch (error) {
      return res.status(403).json({
        message: error.message,
        success: false,
      });
    }

    updatedPet.isPetInWorld = await isPetInWorld(urlSlug, visitor, credentials);

    await visitor.setDataObject({ pet: updatedPet });

    return res.json({ pet: updatedPet, success: true });
  } catch (error) {
    console.error("Error while performing action with the pet: ", error);
    return res.status(500).json({ error: error?.message, success: false });
  }
};

function performAction(pet, actionKey, now) {
  const cooldown = ACTION_COOLDOWNS[actionKey];
  const experienceGain = ACTION_EXPERIENCE_GAIN[actionKey];

  if (!pet[actionKey]) {
    pet[actionKey] = {
      timestamp: 0,
      amount: 0,
    };
  }

  if (!canPerformAction(pet[actionKey].timestamp, now, cooldown)) {
    throw new Error(`Pet doesn't want to ${actionKey} at the moment.`);
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
