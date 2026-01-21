import { Request, Response } from "express";
import {
  DroppedAsset,
  errorHandler,
  getCredentials,
  getVisitorAndPetStatus,
  spawnPetNpc,
  User,
} from "../utils/index.js";
import { IDroppedAsset, IUser } from "../types/index.js";

export const handleGetPet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { assetId, keyAssetId, profileId, urlSlug } = credentials;

    const droppedAsset = (await DroppedAsset.get(assetId, urlSlug, { credentials })) as IDroppedAsset;
    const ownerProfileId = droppedAsset?.dataObject?.profileId;

    if (keyAssetId) credentials.assetId = keyAssetId;

    let isPetOwner = false,
      pets,
      petStatus;

    if (!ownerProfileId || ownerProfileId === profileId) {
      const getVisitorResponse = await getVisitorAndPetStatus(credentials);
      if (getVisitorResponse instanceof Error) throw getVisitorResponse;

      const { pets, visitor, visitorInventory } = getVisitorResponse;

      petStatus = pets ? Object.values(pets).find((pet) => pet.petSpawnedDroppedAssetId === assetId) : null;
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
        petStatus = user.dataObject.pet;
      } else if (user.dataObject?.pets) {
        pets = user.dataObject.pets;
        petStatus = Object.values(user.dataObject.pets).find((pet) => pet.petSpawnedDroppedAssetId === assetId);
      }
    }

    return res.json({
      petStatus,
      isPetOwner,
      pets,
      selectedPetId: petStatus?.id,
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
