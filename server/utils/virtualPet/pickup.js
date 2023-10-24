import { Visitor, World } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";

export const pickup = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
      isSpawnedDroppedAsset,
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

    // This function loads the visitor's data object, because it's not there by default when we load the visitor
    await visitor.fetchDataObject();

    await removeAllUserPets(urlSlug, visitor, credentials);

    if (isSpawnedDroppedAsset) {
      await visitor.closeIframe(assetId);
    }

    return res.json({ success: true });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🐹 Error while picking up the pet",
      functionName: "pickup",
      req,
    });
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
