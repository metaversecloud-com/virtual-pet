import { logger } from "../../logs/logger.js";
import { getVisitorWithDataObject } from "./utils.js";
import { addNewRowToGoogleSheets } from "../utils/addNewRowToGoogleSheets.js";
import { getCredentials } from "../../getCredentials.js";

export const create = async (req, res) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, profileId, identityId, displayName } = credentials;

    const { petType, name } = req.body;

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
        {
          analytics: [
            { analyticName: `starts`, profileId, uniqueKey: profileId },
            { analyticName: `starts-${petType}`, profileId, uniqueKey: profileId },
          ],
        },
      );

      addNewRowToGoogleSheets({
        identityId,
        displayName,
        appName: "Virtual Pet",
        event: "starts",
        urlSlug,
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
