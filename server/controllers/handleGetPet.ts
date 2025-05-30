import { Request, Response } from "express";
import { DroppedAsset, errorHandler, getCredentials, getVisitorAndPetStatus, User } from "../utils/index.js";
import { IDroppedAsset, IUser } from "../types/index.js";

export const handleGetPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { assetId, keyAssetId, profileId, urlSlug } = credentials;

    const droppedAsset = (await DroppedAsset.get(assetId, urlSlug, { credentials })) as IDroppedAsset;
    const ownerProfileId = droppedAsset?.dataObject?.profileId;

    if (keyAssetId) credentials.assetId = keyAssetId;

    if (!ownerProfileId || ownerProfileId === profileId) {
      const { petStatus } = await getVisitorAndPetStatus(credentials);

      return res.json({
        isPetAssetOwner: true,
        isPetInWorld: true,
        petStatus,
      });
    }

    // not owner view
    const user = User.create({
      credentials,
      profileId: ownerProfileId,
    }) as IUser;
    await user.fetchDataObject();

    return res.json({
      petStatus: user?.dataObject?.pet,
      isPetAssetOwner: false,
      isPetInWorld: true,
    });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleGetPet",
      message: "Error getting pet",
      req,
      res,
    });
  }
};
