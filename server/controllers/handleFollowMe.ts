import { Request, Response } from "express";
import { errorHandler, getCredentials, getVisitorAndPetStatus } from "../utils/index.js";
import { petFollowMe } from "../utils/petFollowMe.js";

export const handleFollowMe = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { petStatus, visitor } = await getVisitorAndPetStatus(credentials);

    const petVisitor = await petFollowMe({ credentials, petStatus, visitor });

    return res.json({ isPetAssetOwner: true, isPetInWorld: true, petStatus, visitorHasPet: true, petVisitor });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleFollowMe",
      message: "Error following pet",
      req,
      res,
    });
  }
};
