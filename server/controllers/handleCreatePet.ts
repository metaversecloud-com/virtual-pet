import { Request, Response } from "express";
import {
  addNewRowToGoogleSheets,
  awardBadge,
  errorHandler,
  getCredentials,
  getVisitorAndPetStatus,
} from "../utils/index.js";
import { defaultPetStatus } from "../constants.js";

export const handleCreatePet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { displayName, identityId, profileId, urlSlug, username } = credentials;
    const { keyAssetId, petType, name } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const promises = [];

    const { pets, visitor, visitorInventory } = await getVisitorAndPetStatus(credentials);

    const createdDate = new Date().getTime();
    const selectedPetId = `${petType}_${createdDate}`;

    const pet = {
      ...defaultPetStatus,
      id: selectedPetId,
      username: displayName || username,
      experience: 0,
      petType,
      name,
      color: 0,
      createdDate,
    };

    const updatedPets = { ...pets, [selectedPetId]: pet };
    promises.push(
      visitor.updateDataObject(
        { pets: updatedPets },
        {
          analytics: [
            { analyticName: `starts`, profileId, uniqueKey: profileId },
            { analyticName: `starts-${petType}`, profileId, uniqueKey: profileId },
          ],
        },
      ),
    );

    promises.push(
      addNewRowToGoogleSheets([
        {
          identityId,
          displayName,
          event: "starts",
          urlSlug,
          username,
        },
      ]),
    );

    if (Object.keys(updatedPets).length === 1) {
      // Award Baby Steps badge for creating first pet
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Baby Steps",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleCreatePet",
            message: "Error awarding Baby Steps badge",
          }),
        ),
      );
    } else if (Object.keys(updatedPets).length === 3) {
      // Award Pet Party badge for creating 3 pets
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Pet Party",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleCreatePet",
            message: "Error awarding Pet Party badge",
          }),
        ),
      );
    }

    // Award adoption badges for creating a pet
    if (petType === "dragon") {
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Flamekeeper",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleCreatePet",
            message: "Error awarding Flamekeeper badge",
          }),
        ),
      );
    } else if (petType === "unicorn") {
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Dreamkeeper",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleCreatePet",
            message: "Error awarding Dreamkeeper badge",
          }),
        ),
      );
    } else if (petType === "penguin") {
      promises.push(
        awardBadge({
          credentials,
          visitor,
          visitorInventory,
          badgeName: "Icebreaker",
        }).catch((error: any) =>
          errorHandler({
            error,
            functionName: "handleCreatePet",
            message: "Error awarding Icebreaker badge",
          }),
        ),
      );
    }

    const results = await Promise.allSettled(promises);
    results.forEach((result) => {
      if (result.status === "rejected") console.error(result.reason);
    });

    return res.json({ isPetOwner: true, petStatus: pet, selectedPetId, pets: updatedPets, visitorInventory });
  } catch (error) {
    return errorHandler({
      error,
      functionName: "handleCreatePet",
      message: "Error creating pet",
      req,
      res,
    });
  }
};
