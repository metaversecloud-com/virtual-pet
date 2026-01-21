import { Request, Response } from "express";
import { awardBadge, errorHandler, getCredentials, getVisitorAndPetStatus, spawnPetNpc } from "../utils/index.js";

export const handleUpdatePet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { displayName, profileId, username } = credentials;
    const { keyAssetId, selectedName, selectedColor, selectedPetId } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const getVisitorResponse = await getVisitorAndPetStatus(credentials);
    if (getVisitorResponse instanceof Error) throw getVisitorResponse;

    const { pets, visitor, visitorInventory } = getVisitorResponse;

    const petStatus = pets ? pets[selectedPetId] : null;
    if (!petStatus) throw new Error("No pet status found for visitor");

    // Award Fresh Look badge for changing pet color
    if (petStatus.color !== selectedColor) {
      await awardBadge({
        credentials,
        visitor,
        visitorInventory,
        badgeName: "Fresh Look",
      }).catch((error: any) =>
        errorHandler({
          error,
          functionName: "handleUpdatePet",
          message: "Error awarding Fresh Look badge",
        }),
      );
    }

    petStatus.username = displayName || username;
    petStatus.name = selectedName;
    petStatus.color = selectedColor;

    const updatedPets = { ...pets, [selectedPetId]: petStatus };
    await visitor.updateDataObject(
      { pets: updatedPets },
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

    const spawnPetNpcResponse = await spawnPetNpc({
      credentials,
      visitor,
      visitorInventory,
      petStatus,
    });
    if (spawnPetNpcResponse instanceof Error) throw spawnPetNpcResponse;

    return res.json({ isPetOwner: true, petStatus, pets: updatedPets, selectedPetId, visitorInventory });
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
