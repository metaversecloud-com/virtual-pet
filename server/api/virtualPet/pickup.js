import { getCredentials } from "../../getCredentials.js";
import { logger } from "../../logs/logger.js";
import { removeAllUserPets, getVisitorWithDataObject } from "./utils.js";

export const pickup = async (req, res) => {
  try {
    const { keyAssetId } = req.body;
    let credentials = getCredentials(req.query);
    if (keyAssetId) credentials.assetId = keyAssetId;
    const { urlSlug } = credentials;

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
