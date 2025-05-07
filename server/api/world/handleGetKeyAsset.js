import { getCredentials } from "../../getCredentials.js";
import { logger } from "../../logs/logger.js";
import { World } from "../topiaInit.js";

export const handleGetKeyAsset = async (req, res) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug } = credentials;

    const world = World.create(urlSlug, { credentials });
    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({ uniqueName: "virtualPetKeyAsset" });

    return res.json({ keyAssetId: droppedAssets[0].id });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🐹 Error while getting key asset",
      functionName: "handleGetKeyAsset",
      req,
    });
    return res.status(500).send({ error: error?.message, success: false });
  }
};
