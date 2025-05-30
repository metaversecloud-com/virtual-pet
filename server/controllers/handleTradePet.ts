import { Request, Response } from "express";
import { errorHandler, getCredentials, removeDroppedAssets, Visitor } from "../utils/index.js";
import { VisitorInterface } from "@rtsdk/topia";

export const handleTradePet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug, username, visitorId } = credentials;

    const { keyAssetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const visitor: VisitorInterface = await Visitor.create(visitorId, urlSlug, { credentials });

    await visitor.setDataObject(
      {},
      {
        analytics: [{ analyticName: `trades`, uniqueKey: profileId, profileId }],
      },
    );

    await removeDroppedAssets(credentials, `petSystem-${username}`);

    return res.json({ isPetAssetOwner: false, isPetInWorld: false, petStatus: {}, visitorHasPet: false });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleTradePet",
      message: "Error trading pet",
      req,
      res,
    });
  }
};
