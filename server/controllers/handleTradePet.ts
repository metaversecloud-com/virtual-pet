import { Request, Response } from "express";
import { errorHandler, getCredentials, getVisitorAndPetStatus } from "../utils/index.js";

export const handleTradePet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { profileId, urlSlug } = credentials;

    const { keyAssetId, selectedPetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { pets, visitor } = await getVisitorAndPetStatus(credentials);

    const petStatus = pets ? pets[selectedPetId] : null;
    if (!petStatus) throw new Error("No pet status found for visitor");

    // Only despawn the in-world NPC if the pet being traded is the one currently spawned.
    // Otherwise we'd kick out an unrelated pet (e.g. trading Pet B while Pet A is in world).
    if (petStatus.isPetInWorld) await visitor.deleteNpc();

    delete pets[selectedPetId];

    await visitor.updateDataObject(
      { pets },
      {
        analytics: [{ analyticName: `trades`, uniqueKey: profileId, profileId, urlSlug }],
      },
    );

    return res.json({ petStatus: {}, pets, selectedPetId: null });
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
