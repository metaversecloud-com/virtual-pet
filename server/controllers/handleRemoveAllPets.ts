import { Request, Response } from "express";
import { errorHandler, getCredentials, removeDroppedAssets, World } from "../utils/index.js";

export const handleRemoveAllPets = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug } = credentials;
    const { keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const world = World.create(urlSlug, { credentials });

    await removeDroppedAssets(credentials);

    await world
      .updateDataObject({}, { analytics: [{ analyticName: `adminPickupAllPets`, urlSlug }] })
      .then()
      .catch(() => console.error("Error sending analytics for adminPickupAllPets"));

    return res.json({ isPetInWorld: false });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleRemoveAllPets",
      message: "Error removing dropped assets",
      req,
      res,
    });
  }
};
