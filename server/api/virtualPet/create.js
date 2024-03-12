import { Visitor } from "../topiaInit.js";
import { logger } from "../../logs/logger.js";

export const create = async (req, res) => {
  try {
    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
    } = req.query;

    const { petType, name } = req.body;

    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials: {
        assetId,
        interactiveNonce,
        interactivePublicKey,
        visitorId,
      },
    });

    await visitor.fetchDataObject();

    let pet;
    if (!visitor?.dataObject?.pet) {
      pet = {
        username: visitor?.username,
        experience: 0,
        petType,
        name,
        color: 0,
      };
      await visitor.setDataObject({ pet });
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
