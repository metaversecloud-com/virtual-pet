import { Request, Response } from "express";
import { Ecosystem, errorHandler, getCredentials, getVisitorAndPetStatus } from "../utils/index.js";

export const handleGetGameState = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const keyAssetId = req.query.keyAssetId as string;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const getVisitorResponse = await getVisitorAndPetStatus(credentials);
    if (getVisitorResponse instanceof Error) throw getVisitorResponse;

    const { isAdmin, pets, selectedPetId, petStatus, isPetOwner } = getVisitorResponse;

    const ecosystem = await Ecosystem.create({ credentials });
    await ecosystem.fetchInventoryItems();

    return res.json({
      isAdmin,
      pets,
      selectedPetId,
      petStatus,
      isPetOwner,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleGetGameState",
      message: "Error getting visitor and data object",
      req,
      res,
    });
  }
};
