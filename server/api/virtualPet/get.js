import { DroppedAsset, Visitor, User } from "../topiaInit.js";
import { isPetInWorld } from "./utils.js";
import { logger } from "../../logs/logger.js";
import { getCredentials } from "../../getCredentials.js";

export const get = async (req, res) => {
  try {
    let credentials = await getCredentials(req.query);
    const { assetId, urlSlug, visitorId } = credentials;

    let petSpawnedDroppedAsset;

    try {
      petSpawnedDroppedAsset = DroppedAsset.create(assetId, urlSlug, {
        credentials,
      });
      await Promise.all([petSpawnedDroppedAsset.fetchDroppedAssetById(), petSpawnedDroppedAsset.fetchDataObject()]);
    } catch (error) {
      console.log("Pet no longer in world");
    }

    if (req.query.keyAssetId) credentials.assetId = req.query.keyAssetId;

    const visitor = Visitor.create(visitorId, urlSlug, { credentials });
    await Promise.all([visitor.fetchVisitor(), visitor.fetchDataObject()]);

    let isPetAssetOwner = false;
    if (
      !petSpawnedDroppedAsset?.dataObject?.profileId ||
      petSpawnedDroppedAsset?.dataObject?.profileId === visitor?.profileId
    ) {
      isPetAssetOwner = true;
    } else {
      // not owner view
      const user = User.create({
        credentials,
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

    visitor.dataObject.pet.isPetInWorld = await isPetInWorld(urlSlug, visitor, credentials);

    return res.json({
      pet: visitor?.dataObject?.pet,
      visitor,
      isPetAssetOwner,
      success: true,
    });
  } catch (error) {
    logger.error({
      error,
      message: "❌ Error while getting the pet",
      functionName: "get",
      req,
    });
    return res.status(500).send({ requestId: req.id, error: error?.message, success: false });
  }
};
