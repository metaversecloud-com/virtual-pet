import { Visitor } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";
import { removeAllUserPets, getVisitorWithDataObject } from "./utils.js";

export const pickup = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
    } = req.query;

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = await getVisitorWithDataObject({ credentials, urlSlug });

    await removeAllUserPets(urlSlug, visitor, credentials);

    return res.json({ success: true });
  } catch (error) {
    logger.error({
      error,
      message: "❌ 🐹 Error while picking up the pet",
      functionName: "pickup",
      req,
    });
    return res.status(500).send({ error: error?.message, success: false });
  }
};
