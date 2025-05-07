import { Visitor } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";
import { removeAllUserPets } from "./utils.js";
import { getCredentials } from "../../getCredentials.js";

export const deletePet = async (req, res) => {
  try {
    const credentials = getCredentials(req.query);
    const { urlSlug, visitorId, profileId } = credentials;

    const visitor = await Visitor.get(visitorId, urlSlug, { credentials });

    await visitor.setDataObject(
      {},
      {
        analytics: [{ analyticName: `trades`, uniqueKey: profileId, profileId }],
      },
    );
    await visitor.fetchDataObject();

    await removeAllUserPets(urlSlug, visitor, credentials);

    return res.json({ pet: visitor?.dataObject?.pet });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🏗️ Error while deleting the pet",
      functionName: "create",
      req,
    });
    return res.status(500).send({ error: error?.message, success: false });
  }
};
