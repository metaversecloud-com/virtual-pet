import { DroppedAsset, Visitor, User } from "../topiaInit.js";
import { isPetInWorld } from "./utils.js";
import { logger } from "../../logs/logger.js";
import { handleSpawnPet } from "./spawn.js";
import { getCredentials } from "../../getCredentials.js";

export const update = async (req, res) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId, profileId } = credentials;

    const { name, color } = req?.body;

    const visitor = Visitor.create(visitorId, urlSlug, { credentials });
    const petSpawnedDroppedAsset = DroppedAsset.create(credentials?.assetId, urlSlug, { credentials });
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

    visitor.dataObject.pet.isPetInWorld = await isPetInWorld(urlSlug, visitor, credentials);

    let pet = visitor?.dataObject?.pet;
    pet.name = name;
    pet.color = color;

    await visitor.updateDataObject(
      { pet },
      {
        analytics: [
          {
            analyticName: `updates`,
            uniqueKey: profileId,
            profileId,
          },
        ],
      },
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
    return res.status(500).send({ requestId: req.id, error: error?.message, success: false });
  }
};
