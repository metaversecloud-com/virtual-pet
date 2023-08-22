import { DroppedAsset, Visitor, Asset, World } from "../topiaInit.js";
import constants from "../../constants.js";

let BASE_URL;
/**
 * This module contains the logic for spawning a virtual pet in the virtual world.
 * It handles the following operations:
 * 1. Fetching the visitor and their associated pet data.
 * 2. Deleting any existing pets that the user may have spawned in the world.
 * 3. Creating and configuring a new "Web Image Asset" that represents the pet.
 *    - The pet's image is determined by the pet's type and it's experience level.
 *    - The asset is set up to open in the drawer when clicked.
 */
export const spawn = async (req, res) => {
  try {
    console.log("Spawning the Pet");
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
    } = req.query;

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

    const protocol = req.protocol;
    const host = req.host;
    const port = req.port;

    if (host === "localhost") {
      BASE_URL = `https://virtual-pet.topia-rtsdk.com`;
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

    // This function loads the visitor's data object, because it's not there by default when we load the visitor
    await visitor.fetchDataObject();

    // The pet is stored in the vistor's dataObject so it can be used in multiple worlds
    const pet = visitor?.dataObject?.pet;

    await removeAllUserPets(urlSlug, visitor, credentials);

    await dropImageAsset(urlSlug, credentials, visitor, pet);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error while spawning the pet", error);
    return res
      .status(500)
      .send({ error: JSON.stringify(error), success: false });
  }
};

/*
 *   This function removes all pet assets that a user has placed in the world.
 *   Note: As of the current version, a user can only have one pet asset in the world at a time.
 */
async function removeAllUserPets(urlSlug, visitor, credentials) {
  const world = await World.create(urlSlug, { credentials });

  try {
    const petAssets = await world.fetchDroppedAssetsWithUniqueName({
      uniqueName: `petSystem-${visitor?.username}`,
    });

    if (petAssets && petAssets.length) {
      await Promise.all(
        petAssets.map((petAsset) => petAsset.deleteDroppedAsset())
      );
    }
  } catch (error) {
    console.log("There are no pets to be deleted.");
  }
}

/*
 *  This function:
 *  1. Drops a a special Topia's blank asset called "Web Image Asset".
 *  2. Place a pet image when Updating the image of the Web Image Asset.
 *  3. Configure the asset to be opened in the drawer when clicked.
 */
async function dropImageAsset(urlSlug, credentials, visitor, pet) {
  const { visitorId, interactiveNonce, interactivePublicKey } = credentials;

  const level = Math.floor(pet?.experience / 100);

  const petImgUrl = getPetImgUrl(pet?.petType, level);

  const { moveTo, username } = visitor;
  const { x, y } = moveTo;
  const position = {
    x: x + 100,
    y: y,
  };
  const uniqueName = `petSystem-${username}`;

  const asset = await Asset.create(process.env.IMG_ASSET_ID, { credentials });

  const petSpawnedDroppedAsset = await DroppedAsset.drop(asset, {
    position,
    uniqueName,
    urlSlug,
  });

  await petSpawnedDroppedAsset?.updateDataObject({
    profileId: visitor?.profileId,
  });

  await petSpawnedDroppedAsset?.updateClickType({
    clickType: "link",
    clickableLink: `${BASE_URL}?visitorId=${visitorId}&interactiveNonce=${interactiveNonce}&assetId=${petSpawnedDroppedAsset?.id}&interactivePublicKey=${interactivePublicKey}&urlSlug=${urlSlug}`,
    clickableLinkTitle: "Virtual Pet",
    clickableDisplayTextDescription: "Play with your Virtual Pet",
    clickableDisplayTextHeadline: "Virtual Pet",
    isOpenLinkInDrawer: true,
  });

  await petSpawnedDroppedAsset?.setInteractiveSettings({
    isInteractive: true,
    interactivePublicKey: process.env.INTERACTIVE_KEY,
  });

  await petSpawnedDroppedAsset?.updateWebImageLayers(petImgUrl, petImgUrl);

  return petSpawnedDroppedAsset;
}

// Get the pet's image Url based on the pet's type and level.
function getPetImgUrl(petType, level) {
  let petImgUrl;
  if (petType === "dragon") {
    if (level === 0) {
      petImgUrl = `${BASE_URL}/assets/dragon/world/baby.png`;
    } else if (level === 1) {
      petImgUrl = `${BASE_URL}/assets/dragon/world/teen.png`;
    } else {
      petImgUrl = `${BASE_URL}/assets/dragon/world/adult.png`;
    }
  } else if (petType === "penguin") {
    if (level === 0) {
      petImgUrl = `${BASE_URL}/assets/penguin/world/baby.png`;
    } else if (level === 1) {
      petImgUrl = `${BASE_URL}/assets/penguin/world/teen.png`;
    } else {
      petImgUrl = `${BASE_URL}/assets/penguin/world/adult.png`;
    }
  } else if (petType === "unicorn") {
    if (level === 0) {
      petImgUrl = `${BASE_URL}/assets/unicorn/world/baby.png`;
    } else if (level === 1) {
      petImgUrl = `${BASE_URL}/assets/unicorn/world/teen.png`;
    } else {
      petImgUrl = `${BASE_URL}/assets/unicorn/world/adult.png`;
    }
  }
  return petImgUrl;
}
