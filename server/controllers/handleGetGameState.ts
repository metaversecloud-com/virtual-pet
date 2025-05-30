import { Request, Response } from "express";
import { errorHandler, getCredentials, getVisitorAndPetStatus, World } from "../utils/index.js";

export const handleGetGameState = async (req: Request, res: Response) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, username } = credentials;
    const keyAssetId = req.query.keyAssetId as string;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { isAdmin, petStatus, visitorHasPet } = await getVisitorAndPetStatus(credentials);

    let isPetInWorld = false;
    if (visitorHasPet) {
      const world = await World.create(urlSlug, { credentials });
      const petAssets = await world
        .fetchDroppedAssetsWithUniqueName({
          uniqueName: `petSystem-${username}`,
        })
        .catch((error) =>
          console.error(`❌ Error retrieving assets with unique name petSystem-${username}`, JSON.stringify(error)),
        );

      if (petStatus) {
        isPetInWorld = !!(petAssets && petAssets.length);
      }
    }

    return res.json({
      isAdmin,
      isPetAssetOwner: true,
      isPetInWorld,
      petStatus,
      visitorHasPet,
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
