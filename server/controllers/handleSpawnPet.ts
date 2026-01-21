import { Request, Response } from "express";
import { errorHandler, getCredentials, getVisitorAndPetStatus, spawnPetNpc } from "../utils/index.js";

export const handleSpawnPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { keyAssetId, selectedPetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const getVisitorResponse = await getVisitorAndPetStatus(credentials);
    if (getVisitorResponse instanceof Error) throw getVisitorResponse;

    const { pets, visitor, visitorInventory } = getVisitorResponse;

    const petStatus = pets ? pets[selectedPetId] : null;
    if (!petStatus) throw new Error("No pet status found for visitor");

    const spawnPetNpcResponse = await spawnPetNpc({
      credentials,
      visitor,
      visitorInventory,
      petStatus,
    });
    if (spawnPetNpcResponse instanceof Error) throw spawnPetNpcResponse;

    petStatus.isPetInWorld = true;

    return res.json({ isPetOwner: true, petStatus, selectedPetId });
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
