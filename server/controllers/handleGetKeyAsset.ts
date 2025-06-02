import { Request, Response } from "express";
import { errorHandler, getCredentials, World } from "../utils/index.js";

export const handleGetKeyAsset = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug } = credentials;

    const world = World.create(urlSlug, { credentials });
    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({ uniqueName: "virtualPetKeyAsset" });

    if (droppedAssets.length === 0) throw "No key asset found";

    return res.json({ keyAssetId: droppedAssets[0].id });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleGetKeyAsset",
      message: "Error getting key asset",
      req,
      res,
    });
  }
};
