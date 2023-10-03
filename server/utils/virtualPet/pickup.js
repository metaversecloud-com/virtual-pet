import { Visitor, World } from "../topiaInit.js";

export const pickup = async (req, res) => {
  try {
    console.log("Spawning the Pet");
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

    // This function loads the visitor's data object, because it's not there by default when we load the visitor
    await visitor.fetchDataObject();

    await removeAllUserPets(urlSlug, visitor, credentials);

    return res.json({ success: true });
  } catch (error) {
    console.error("❌ Error while spawning the pet", JSON.stringify(error));
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
