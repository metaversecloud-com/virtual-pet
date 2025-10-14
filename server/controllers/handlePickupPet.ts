import { Request, Response } from "express";
import { errorHandler, getCredentials, getVisitorAndPetStatus, removeDroppedAssets, World } from "../utils/index.js";

export const handlePickupPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug, username } = credentials;
    const { keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const world = World.create(urlSlug, { credentials });

    await world.updateDataObject(
      {},
      {
        analytics: [{ analyticName: `trades`, uniqueKey: profileId, profileId }],
      },
    );

    await removeDroppedAssets(credentials, `petSystem-${username}`);

    const { visitor } = await getVisitorAndPetStatus(credentials);
    await visitor.deleteFollowingAvatar();

    return res.json({ isPetInWorld: false });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handlePickupPet",
      message: "Error removing dropped asset",
      req,
      res,
    });
  }
};
