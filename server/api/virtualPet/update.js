import { Visitor } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";
import { handleSpawnPet } from "./spawn.js";
import { getCredentials } from "../../getCredentials.js";

export const update = async (req, res) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId, profileId } = credentials;

    const { name, color, keyAssetId, pet } = req?.body;
    if (keyAssetId) credentials.assetId = keyAssetId;
    pet.name = name;
    pet.color = color;

    const visitor = Visitor.create(visitorId, urlSlug, { credentials });

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
      pet,
      success: true,
    });
  } catch (error) {
    logger.error({
      error,
      message: "❌ Error while updating the pet",
      functionName: "get",
      req,
    });
    return res.status(500).send({ requestId: req.id, error: error?.message, success: false });
  }
};
