import { Request, Response } from "express";
import { dropAsset, errorHandler, getCredentials, getVisitorAndPetStatus } from "../utils/index.js";

export const handleUpdatePet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { displayName, profileId, username } = credentials;
    const { keyAssetId, selectedName, selectedColor } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const { petStatus, visitor } = await getVisitorAndPetStatus(credentials);

    petStatus.username = displayName || username;
    petStatus.name = selectedName;
    petStatus.color = selectedColor;

    await visitor.updateDataObject(
      { pet: petStatus },
      {
        analytics: [
          {
            analyticName: `updates`,
            uniqueKey: profileId,
            profileId,
          },
        ],
      },
    );

    await dropAsset({ credentials, petStatus, visitor, host: req.host });

    return res.json({ isPetAssetOwner: true, isPetInWorld: true, petStatus, visitorHasPet: true });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleUpdatePet",
      message: "Error updating pet",
      req,
      res,
    });
  }
};
