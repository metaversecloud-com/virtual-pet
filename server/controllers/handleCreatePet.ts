import { Request, Response } from "express";
import {
  addNewRowToGoogleSheets,
  errorHandler,
  getCredentials,
  getVisitorAndPetStatus,
  Visitor,
} from "../utils/index.js";
import { VisitorInterface } from "@rtsdk/topia";
import { defaultPetStatus } from "../constants.js";

export const handleCreatePet = async (req: Request, res: Response): Promise<Record<string, any> | void> => {
  try {
    const credentials = getCredentials(req.query);
    const { displayName, identityId, profileId, urlSlug, username, visitorId } = credentials;
    const { keyAssetId, petType, name } = req.body;
    if (keyAssetId) credentials.assetId = keyAssetId;

    const visitor: VisitorInterface = await Visitor.create(visitorId, urlSlug, { credentials });

    const pet = {
      ...defaultPetStatus,
      username: displayName || username,
      experience: 0,
      petType,
      name,
      color: 0,
    };

    await visitor.setDataObject(
      { pet },
      {
        analytics: [
          { analyticName: `starts`, profileId, uniqueKey: profileId },
          { analyticName: `starts-${petType}`, profileId, uniqueKey: profileId },
        ],
      },
    );

    addNewRowToGoogleSheets([
      {
        identityId,
        displayName,
        event: "starts",
        urlSlug,
        username,
      },
    ])
      .then()
      .catch();

    const { petStatus } = await getVisitorAndPetStatus(credentials);

    return res.json({ isPetAssetOwner: true, isPetInWorld: false, petStatus, visitorHasPet: true });
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
