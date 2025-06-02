import { Request, Response } from "express";
import { dropAsset, errorHandler, getCredentials, getVisitorAndPetStatus } from "../utils/index.js";

export const handleSpawnPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { petStatus, visitor } = await getVisitorAndPetStatus(credentials);

    await dropAsset({ credentials, petStatus, visitor, host: req.host });

    return res.json({ isPetAssetOwner: true, isPetInWorld: true, petStatus, visitorHasPet: true });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleSpawnPet",
      message: "Error spawning pet",
      req,
      res,
    });
  }
};
