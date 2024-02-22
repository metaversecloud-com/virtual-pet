import { DroppedAsset, Visitor, Asset, World } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";

let BASE_URL;
/**
 * This module contains the logic for spawning a virtual pet in the virtual world.
 * It handles the following operations:
 * 1. Fetching the visitor and their associated pet data.
 * 2. Deleting any existing pets that the user may have spawned in the world.
 * 3. Creating and configuring a new "Web Image Asset" that represents the pet.
 *    - The pet's image is determined by the pet's type and it's experience level.
 */
export const spawn = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
    } = req.query;

    const protocol = process.env.INSTANCE_PROTOCOL;
    const host = req.host;
    const port = req.port;

    if (host === "localhost") {
      BASE_URL = `${protocol}://vpet-dev-topia.topia-rtsdk.com`;
    } else {
      BASE_URL = `${protocol}://${host}`;
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

    const visitorDataObjectAndFetchAllUserPetsResponse = await Promise.all([
      visitor.fetchDataObject(),
      fetchAllUserPets(urlSlug, visitor, credentials),
    ]);

    const userPetAssets = visitorDataObjectAndFetchAllUserPetsResponse?.[1];

    const pet = visitor?.dataObject?.pet;

    await Promise.all([
      removeAllUserPets(userPetAssets),
      dropImageAsset(urlSlug, credentials, visitor, pet),
    ]);

    return res.json({ success: true });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🐰 Error while spawning the pet",
      functionName: "spawn",
      req,
    });
    return res.status(500).send({ error: error?.message, success: false });
  }
};

/*
 *   This function removes all pet assets that a user has placed in the world.
 *   Note: As of the current version, a user can only have one pet asset in the world at a time.
 */
async function removeAllUserPets(userPetAssets) {
  try {
    if (userPetAssets && userPetAssets.length) {
      await Promise.all(
        userPetAssets.map((petAsset) => petAsset.deleteDroppedAsset())
      );
    }
  } catch (error) {
    console.error("❌ There are no pets to be deleted.", JSON.stringify(error));
  }
}

async function fetchAllUserPets(urlSlug, visitor, credentials) {
  const world = await World.create(urlSlug, { credentials });
  return world.fetchDroppedAssetsWithUniqueName({
    uniqueName: `petSystem-${visitor?.username}`,
  });
}

/*
 *  This function:
 *  1. Drops a a special Topia's blank asset called "Web Image Asset".
 *  2. Place a pet image when Updating the image of the Web Image Asset.
 *  3. Configure the asset to be opened in the drawer when clicked.
 */
async function dropImageAsset(urlSlug, credentials, visitor, pet) {
  const { visitorId, interactiveNonce, interactivePublicKey } = credentials;

  const level = calculateLevel(pet?.experience);

  const { petImgUrlLayer0, petImgUrlLayer1 } = getPetImgUrl(
    pet?.petType,
    level,
    pet?.color
  );

  const { moveTo, username } = visitor;
  const { x, y } = moveTo;
  const position = {
    x: x + 100,
    y: y,
  };
  const uniqueName = `petSystem-${username}`;

  const asset = await Asset.create(process.env.IMG_ASSET_ID, { credentials });

  const flipped = Math.random() < 0.5;

  const petSpawnedDroppedAsset = await DroppedAsset.drop(asset, {
    position,
    uniqueName,
    urlSlug,
    flipped,
  });

  await Promise.all([
    petSpawnedDroppedAsset?.updateDataObject({
      profileId: visitor?.profileId,
    }),
    petSpawnedDroppedAsset?.updateClickType({
      clickType: "link",
      clickableLink: `${BASE_URL}/asset-type/spawned?visitorId=${visitorId}&interactiveNonce=${interactiveNonce}&assetId=${petSpawnedDroppedAsset?.id}&interactivePublicKey=${interactivePublicKey}&urlSlug=${urlSlug}`,
      clickableLinkTitle: "Virtual Pet",
      clickableDisplayTextDescription: "Play with your Virtual Pet",
      clickableDisplayTextHeadline: "Virtual Pet",
      isOpenLinkInDrawer: true,
    }),
    petSpawnedDroppedAsset?.setInteractiveSettings({
      isInteractive: true,
      interactivePublicKey: process.env.INTERACTIVE_KEY,
    }),
    petSpawnedDroppedAsset?.updateWebImageLayers(
      petImgUrlLayer0,
      petImgUrlLayer1
    ),
  ]);

  return petSpawnedDroppedAsset;
}

// Get the pet's image Url based on the pet's type and level.
function getPetImgUrl(petType, level, color) {
  let petImgUrlLayer0 = "";
  let petImgUrlLayer1 = "";
  let petAge = "";
  if (level < 5) {
    petAge = "baby";
  } else if (level >= 5 && level < 10) {
    petAge = "teen";
  } else if (level >= 10) {
    petAge = "adult";
  }

  petImgUrlLayer1 = `${BASE_URL}/assets/${petType}/world/${petAge}-color-${color}.png`;

  return { petImgUrlLayer0, petImgUrlLayer1 };
}

function calculateLevel(exp) {
  if (exp >= 0 && exp < 1000) {
    return 0;
  } else if (exp < 4500) {
    return 1;
  } else if (exp >= 4500) {
    return 2;
  }
  return 0;
}
