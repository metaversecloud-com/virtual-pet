import { Request, Response } from "express";
import {
  errorHandler,
  getCachedInventoryItems,
  getCredentials,
  getVisitorAndPetStatus,
  removeDroppedAssets,
} from "../utils/index.js";
import { BadgesType } from "../../shared/types.js";

export const handleGetGameState = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const keyAssetId = req.query.keyAssetId as string;
    if (keyAssetId) credentials.assetId = keyAssetId;
    const forceRefreshInventory = req.query.forceRefreshInventory === "true";

    const { isAdmin, pets, selectedPetId, petStatus, isPetOwner, visitorInventory } =
      await getVisitorAndPetStatus(credentials);

    const inventoryItems = await getCachedInventoryItems({ credentials, forceRefresh: forceRefreshInventory });

    const badges: BadgesType = {};

    for (const item of inventoryItems) {
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

    await removeDroppedAssets(credentials);

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
