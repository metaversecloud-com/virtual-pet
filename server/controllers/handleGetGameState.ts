import { Request, Response } from "express";
import { Ecosystem, errorHandler, getCredentials, getVisitorAndPetStatus } from "../utils/index.js";
import { BadgesType } from "../../shared/types.js";

export const handleGetGameState = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const keyAssetId = req.query.keyAssetId as string;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const getVisitorResponse = await getVisitorAndPetStatus(credentials);
    if (getVisitorResponse instanceof Error) throw getVisitorResponse;

    const { isAdmin, pets, selectedPetId, petStatus, isPetOwner, visitorInventory } = getVisitorResponse;

    const ecosystem = await Ecosystem.create({ credentials });
    await ecosystem.fetchInventoryItems();

    const badges: BadgesType = {};

    for (const item of ecosystem.inventoryItems) {
      const { id, name, image_path, description, type } = item;
      if (name && type === "BADGE") {
        badges[name] = {
          id: id,
          name: name || "Unknown",
          icon: image_path || "",
          description: description || "",
        };
      }
    }

    return res.json({
      isAdmin,
      pets,
      selectedPetId,
      petStatus,
      isPetOwner,
      badges,
      visitorInventory,
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
