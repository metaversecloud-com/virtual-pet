import { Request, Response } from "express";
import {
  convertPetToPets,
  DroppedAsset,
  errorHandler,
  getCredentials,
  getVisitorAndPetStatus,
  spawnPetNpc,
  User,
} from "../utils/index.js";
import { IDroppedAsset, IUser, PetStatusType } from "../types/index.js";

export const handleGetPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { assetId, keyAssetId, profileId, urlSlug } = credentials;

    const droppedAsset = (await DroppedAsset.get(assetId, urlSlug, { credentials })) as IDroppedAsset;
    const ownerProfileId = droppedAsset?.dataObject?.profileId;

    if (keyAssetId) credentials.assetId = keyAssetId;

    let isPetOwner = false,
      pets: Record<string, PetStatusType> = {},
      petStatus,
      selectedPetId;

    if (!ownerProfileId || ownerProfileId === profileId) {
      const getVisitorResponse = await getVisitorAndPetStatus(credentials);
      if (getVisitorResponse instanceof Error) throw getVisitorResponse;

      const { pets, visitor, visitorInventory } = getVisitorResponse;

      selectedPetId = Object.keys(pets).find((pet) => pets[pet].petSpawnedDroppedAssetId === assetId);
      petStatus = pets[selectedPetId || ""];
      isPetOwner = true;

      if (petStatus) {
        const spawnPetNpcResponse = await spawnPetNpc({
          credentials,
          visitor,
          visitorInventory,
          petStatus,
        });
        if (spawnPetNpcResponse instanceof Error) throw spawnPetNpcResponse;
      }
    } else {
      // not owner view
      const user = User.create({
        credentials,
        profileId: ownerProfileId,
      }) as IUser;
      await user.fetchDataObject();

      if (user.dataObject?.pet) {
        pets = convertPetToPets(user.dataObject.pet);

        petStatus = user.dataObject.pet;
        selectedPetId = petStatus.id;

        user.dataObject.pets = pets;
        delete user.dataObject.pet;

        await user.setDataObject({ pets });
      } else if (user.dataObject?.pets) {
        pets = user.dataObject.pets;
        selectedPetId = Object.keys(pets).find((pet) => pets[pet].petSpawnedDroppedAssetId === assetId);
        petStatus = pets[selectedPetId || ""];
      }
    }

    return res.json({
      petStatus,
      isPetOwner,
      pets,
      selectedPetId,
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
