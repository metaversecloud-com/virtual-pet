import { DroppedAsset, Visitor, User, World } from "../topiaInit.js";
import { isPetInWorld } from "./utils.js";

export const get = async (req, res) => {
  try {
    console.info("get  ********✅");

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

    const visitor = Visitor.create(visitorId, urlSlug, { credentials });
    const petSpawnedDroppedAsset = DroppedAsset.create(assetId, urlSlug, {
      credentials,
    });
    await Promise.all([
      petSpawnedDroppedAsset.fetchDroppedAssetById(),
      petSpawnedDroppedAsset.fetchDataObject(),
      visitor.fetchVisitor(),
      visitor.fetchDataObject(),
    ]);

    let isPetAssetOwner = false;
    if (
      !petSpawnedDroppedAsset?.dataObject?.profileId ||
      petSpawnedDroppedAsset?.dataObject?.profileId === visitor?.profileId
    ) {
      isPetAssetOwner = true;
    } else {
      // not owner view
      const user = User.create({
        profileId: petSpawnedDroppedAsset?.dataObject?.profileId,
      });
      await user.fetchDataObject();

      return res.json({
        pet: user?.dataObject?.pet,
        visitor,
        isPetAssetOwner: false,
        success: true,
      });
    }

    // User has no pet yet
    if (!visitor.dataObject.pet) {
      return res.json({
        pet: null,
        visitor,
        isPetAssetOwner: false,
        success: true,
      });
    }

    visitor.dataObject.pet.isPetInWorld = await isPetInWorld(
      urlSlug,
      visitor,
      credentials
    );

    return res.json({
      pet: visitor?.dataObject?.pet,
      visitor,
      isPetAssetOwner,
      success: true,
    });
  } catch (error) {
    console.error("Error while getting the pet: ", error);
    return res.status(500).send({ error, success: false });
  }
};
