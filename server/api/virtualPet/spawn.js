import { DroppedAsset, Visitor, Asset, World } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";
import {
  getLevel,
  removeAllUserPets,
  getVisitorWithDataObject,
} from "./utils.js";
import { getS3URL } from "../../utils.js";

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
    await handleSpawnPet(req);
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

export async function handleSpawnPet(req) {
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

  let parentAssetId = req.query.parentAssetId;
  if (parentAssetId == "null" || !parentAssetId) {
    parentAssetId = assetId;
  }

  if (host === "localhost") {
    BASE_URL = "http://localhost:3001";
  } else {
    BASE_URL = `${protocol}://${host}`;
  }

  const credentials = {
    assetId: parentAssetId ? parentAssetId : assetId,
    interactiveNonce,
    interactivePublicKey,
    visitorId,
  };

  const visitor = await getVisitorWithDataObject({ credentials, urlSlug });

  const pet = visitor?.dataObject?.pet;

  await removeAllUserPets(urlSlug, visitor, credentials);
  await dropImageAsset(urlSlug, credentials, visitor, pet, parentAssetId);
}

/*
 *  This function:
 *  1. Drops a a special Topia's blank asset called "Web Image Asset".
 *  2. Place a pet image when Updating the image of the Web Image Asset.
 *  3. Configure the asset to be opened in the drawer when clicked.
 */
async function dropImageAsset(
  urlSlug,
  credentials,
  visitor,
  pet,
  parentAssetId
) {
  const { visitorId, interactiveNonce, interactivePublicKey } = credentials;

  const level = getLevel(pet?.experience);

  const { petImgUrlLayer0, petImgUrlLayer1 } = getPetImgUrl(
    pet?.petType,
    level?.currentLevel,
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

  let petSpawnedDroppedAsset;
  try {
    petSpawnedDroppedAsset = await DroppedAsset.drop(asset, {
      position,
      uniqueName,
      urlSlug,
      flipped,
      isInteractive: true,
      interactivePublicKey: process.env.INTERACTIVE_KEY,
      layer0: petImgUrlLayer0,
      layer1: petImgUrlLayer1,
    });
  } catch (error) {
    // This solves a bug where the asset is not dropped in the world for legacy assets with outdated urls from the old version.
    await visitor?.closeIframe(credentials?.assetId);
  }

  await Promise.all([
    petSpawnedDroppedAsset?.updateDataObject({
      profileId: visitor?.profileId,
    }),
    petSpawnedDroppedAsset?.updateClickType({
      clickType: "link",
      clickableLink: `${BASE_URL}/asset-type/spawned?visitorId=${visitorId}&interactiveNonce=${interactiveNonce}&assetId=${petSpawnedDroppedAsset?.id}&interactivePublicKey=${interactivePublicKey}&urlSlug=${urlSlug}&parentAssetId=${parentAssetId}`,
      clickableLinkTitle: "Virtual Pet",
      clickableDisplayTextDescription: "Play with your Virtual Pet",
      clickableDisplayTextHeadline: "Virtual Pet",
      isOpenLinkInDrawer: true,
    }),
    visitor.updateDataObject({
      petSpawnedDroppedAssetId: petSpawnedDroppedAsset?.id,
    }),
  ]);

  return petSpawnedDroppedAsset;
}

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

  petImgUrlLayer1 = `${getS3URL()}/assets/${petType}/world/${petAge}-color-${color}.png`;

  return { petImgUrlLayer0, petImgUrlLayer1 };
}
