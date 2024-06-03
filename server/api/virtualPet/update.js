import { DroppedAsset, Visitor, User, World } from "../topiaInit.js";
import { isPetInWorld } from "./utils.js";
import { logger } from "../../logs/logger.js";
import { handleSpawnPet } from "./spawn.js";

export const update = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
      profileId,
    } = req.query;

    const { name, color } = req?.body;

    let parentAssetId = req.query.parentAssetId;
    if (parentAssetId == "null" || !parentAssetId) {
      parentAssetId = assetId;
    }

    const credentials = {
      assetId: parentAssetId ? parentAssetId : assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = Visitor.create(visitorId, urlSlug, { credentials });
    const petSpawnedDroppedAsset = DroppedAsset.create(
      credentials?.assetId,
      urlSlug,
      {
        credentials,
      }
    );
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

    let pet = visitor?.dataObject?.pet;
    pet.name = name;
    pet.color = color;

    await visitor.updateDataObject(
      { pet },
      {
        analytics: [
          {
            analyticName: `nameOrColorUpdated`,
            uniqueKey: profileId,
            profileId,
          },
        ],
      }
    );

    await handleSpawnPet(req);

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
    return res
      .status(500)
      .send({ requestId: req.id, error: error?.message, success: false });
  }
};
