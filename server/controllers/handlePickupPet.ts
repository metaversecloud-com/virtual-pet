import { Request, Response } from "express";
import { errorHandler, getCredentials, World, Visitor } from "../utils/index.js";

export const handlePickupPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug, visitorId } = credentials;

    const visitor = await Visitor.create(visitorId, urlSlug, { credentials });
    await visitor.deleteNpc();

    const world = World.create(urlSlug, { credentials });

    await world.updateDataObject(
      {},
      {
        analytics: [{ analyticName: `trades`, uniqueKey: profileId, profileId }],
      },
    );

    return res.json({ success: true });
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
