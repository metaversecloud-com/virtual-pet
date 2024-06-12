import { Visitor } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";
import { getVisitorWithDataObject } from "./utils.js";
import { addNewRowToGoogleSheets } from "../utils/addNewRowToGoogleSheets.js";

export const create = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
      profileId,
      identityId,
      displayName,
    } = req.query;

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const { petType, name } = req.body;

    let formattedIdentityId = identityId;
    if (!identityId || identityId === "null") {
      formattedIdentityId = "";
    }

    let formattedDisplayName = displayName;
    if (!displayName || displayName === "null") {
    }

    const visitor = await getVisitorWithDataObject({ credentials, urlSlug });

    let pet;
    if (!visitor?.dataObject?.pet) {
      pet = {
        username: visitor?.username,
        experience: 0,
        petType,
        name,
        color: 0,
      };
      await visitor.setDataObject(
        { pet },
        { analytics: [{ analyticName: `starts`, uniqueKey: profileId }] }
      );

      addNewRowToGoogleSheets({
        identityId: formattedIdentityId,
        displayName: formattedDisplayName,
        appName: "Virtual Pet",
        event: "starts",
      })
        .then()
        .catch();
    }

    return res.json({ pet: visitor?.dataObject?.pet, success: true });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🏗️ Error while creating the pet for the first time",
      functionName: "create",
      req,
    });
    return res.status(500).send({ error: error?.message, success: false });
  }
};
