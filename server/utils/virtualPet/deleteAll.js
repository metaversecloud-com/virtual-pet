import axios from "axios";
import { Visitor, World, DroppedAsset } from "../topiaInit.js";

export const deleteAll = async (req, res) => {
  try {
    console.info("deleteAll  ********✅");

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

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials,
    });

    if (!visitor?.isAdmin) {
      return res.status(401).json({
        msg: "Only admins have enough permissions to pick up all pets",
      });
    }

    const world = await World.create(urlSlug, { credentials });

    const allPetAssets = await getAllPetAssets(urlSlug, visitor, world);

    await deleteAllPets(urlSlug, allPetAssets, credentials);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error while deleting all the pets: ", error);
    return res.status(500).send({ error, success: false });
  }
};

async function deleteAllPets(urlSlug, petAssets, credentials) {
  petAssets.map((petAsset) => deletePetRequest(urlSlug, petAsset, credentials));
}

async function deletePetRequest(urlSlug, petAsset, credentials) {
  const droppedAsset = await DroppedAsset.get(petAsset?.id, urlSlug, {
    credentials,
  });

  await droppedAsset.deleteDroppedAsset();
}

async function getAllPetAssets(urlSlug, visitor, world) {
  await world.fetchDroppedAssets();
  const allAssets = world.droppedAssets;

  const keys = Object.entries(allAssets);
  let arr = keys.map((test) => {
    return test[1];
  });
  arr = Array.from(arr);

  const petAsset = arr?.filter(
    (item) => item.uniqueName && item.uniqueName?.includes(`petSystem-`)
  );

  return petAsset;
}
