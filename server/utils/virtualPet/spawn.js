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
      BASE_URL = `${protocol}://virtual-pet.topia-rtsdk.com`;
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
    console.error(
      "❌ Error while spawning the pet: ",
      { requestId: req.id, reqQuery: req.query, reqBody: req.body },
      JSON.stringify(error)
    );
    return res.status(500).send({ error: error?.message, success: false });
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
    console.error("❌ There are no pets to be deleted.", JSON.stringify(error));
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

  const level = calculateLevel(pet?.experience);

  const { petImgUrlLayer0, petImgUrlLayer1 } = getPetImgUrl(
    pet?.petType,
    level
  );

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

  await petSpawnedDroppedAsset?.updateWebImageLayers(
    petImgUrlLayer0,
    petImgUrlLayer1
  );

  return petSpawnedDroppedAsset;
}

// Get the pet's image Url based on the pet's type and level.
function getPetImgUrl(petType, level) {
  let petImgUrlLayer0;
  let petImgUrlLayer1;
  if (petType === "dragon") {
    if (level === 0) {
      petImgUrlLayer0 = `${BASE_URL}/assets/dragon/world/D3_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/dragon/world/D3_Layer1.png`;
    } else if (level === 1) {
      petImgUrlLayer0 = `${BASE_URL}/assets/dragon/world/D2_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/dragon/world/D2_Layer1.png`;
    } else {
      petImgUrlLayer0 = `${BASE_URL}/assets/dragon/world/D1_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/dragon/world/D1_Layer1.png`;
    }
  } else if (petType === "penguin") {
    if (level === 0) {
      petImgUrlLayer0 = `${BASE_URL}/assets/penguin/world/P3_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/penguin/world/P3_Layer1.png`;
    } else if (level === 1) {
      petImgUrlLayer0 = `${BASE_URL}/assets/penguin/world/P2_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/penguin/world/P2_Layer1.png`;
    } else {
      petImgUrlLayer0 = `${BASE_URL}/assets/penguin/world/P1_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/penguin/world/P1_Layer1.png`;
    }
  } else if (petType === "unicorn") {
    if (level === 0) {
      petImgUrlLayer0 = `${BASE_URL}/assets/unicorn/world/U3_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/unicorn/world/U3_Layer1.png`;
    } else if (level === 1) {
      petImgUrlLayer0 = `${BASE_URL}/assets/unicorn/world/U2_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/unicorn/world/U2_Layer1.png`;
    } else {
      petImgUrlLayer0 = `${BASE_URL}/assets/unicorn/world/U1_Layer0.png`;
      petImgUrlLayer1 = `${BASE_URL}/assets/unicorn/world/U1_Layer1.png`;
    }
  }

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
