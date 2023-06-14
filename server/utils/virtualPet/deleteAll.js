import axios from "axios";
import { Visitor } from "../topiaInit.js";

export const deleteAll = async (req, res) => {
  try {
    console.info("deleteAll  ********✅");

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

    const credentials = {
      assetId,
      interactiveNonce,
      interactivePublicKey,
      visitorId,
    };

    const visitor = await Visitor.get(visitorId, urlSlug, {
      credentials,
    });

    if (!visitor?.isAdmin) {
      return res.status(401).json({
        msg: "Only admins have enough permissions to remove all pets",
      });
    }

    const allPetAssets = await getAllPetAssets(urlSlug, visitor);

    await deleteAllPets(urlSlug, allPetAssets);

    return res.json({ success: true });
  } catch (error) {
    console.error("Error while deleting all the pets: ", error);
    return res.status(500).send({ error, success: false });
  }
};

async function deleteAllPets(urlSlug, petAssets) {
  petAssets.map((petAsset) => deletePetRequest(urlSlug, petAsset));
}

async function deletePetRequest(urlSlug, petAsset) {
  var data = {};

  var config = {
    method: "delete",
    url: `https://${process.env.INSTANCE_DOMAIN}/api/v1/world/${urlSlug}/assets/${petAsset?.id}`,
    headers: {
      accept: "application/json",
      authorization: process.env.API_KEY,
      "Content-Type": "application/json",
    },
    data,
  };

  return axios(config);
}

async function getAllPetAssets(urlSlug) {
  var data = {};

  var config = {
    method: "get",
    url: `https://${process.env.INSTANCE_DOMAIN}/api/v1/world/${urlSlug}/assets`,
    headers: {
      accept: "application/json",
      authorization: process.env.API_KEY,
      "Content-Type": "application/json",
    },
    data: data,
  };

  const allAssets = await axios(config);

  const petAsset = allAssets?.data?.filter(
    (item) => item.uniqueName && item.uniqueName?.includes(`petSystem-`)
  );

  return petAsset;
}
