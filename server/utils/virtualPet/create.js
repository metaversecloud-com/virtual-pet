import { Visitor } from "../topiaInit.js";

export const create = async (req, res) => {
  try {
    console.info("create  ********✅");

    const {
      assetId,
      interactivePublicKey,
      interactiveNonce,
      urlSlug,
      visitorId,
    } = req.query;

    if (
      !assetId ||
      !interactivePublicKey ||
      !interactiveNonce ||
      !urlSlug ||
      !visitorId
    ) {
      return res.status(400).json({
        message:
          "Missing required data in the request: 'assetId, interactivePublicKey, interactiveNonce, urlSlug, visitorId'",
        success: false,
      });
    }

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
        food: { foodTimestamp: Date.now(), amount: 0 },
        petType,
        name,
      };
      await visitor.setDataObject({ pet });
    }

    return res.json({ pet: visitor?.dataObject?.pet, success: true });
  } catch (error) {
    console.error("Error while creating the pet for the first time: ", error);
    return res.status(500).send({ error, success: false });
  }
};
