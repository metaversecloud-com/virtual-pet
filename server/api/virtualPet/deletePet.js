import { Visitor } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";
import { removeAllUserPets } from "./utils.js";

export const deletePet = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
      profileId,
    } = req.query;

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });

    await removeAllUserPets(urlSlug, visitor, credentials);

    await visitor.setDataObject(
      {},
      { analytics: [`trades`], uniqueKey: profileId }
    );
    await visitor.fetchDataObject();

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
