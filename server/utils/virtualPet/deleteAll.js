import { Visitor, World, DroppedAsset } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";

export const deleteAll = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
    } = req.query;

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
    logger.error({
      error,
      message: "❌ 🧹 Error while deleting all the pets",
      functionName: "deleteAll",
      req,
    });
    return res.status(500).send({ error: error?.message, success: false });
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
