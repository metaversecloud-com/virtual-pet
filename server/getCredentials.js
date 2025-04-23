import { logger } from "./logs/logger.js";

export const getCredentials = () => {
  try {
    const requiredFields = ["interactiveNonce", "interactivePublicKey", "urlSlug", "visitorId"];
    const missingFields = requiredFields.filter((variable) => !query[variable]);
    if (missingFields.length > 0) {
      throw `Missing required body parameters: ${missingFields.join(", ")}`;
    }

    if (process.env.INTERACTIVE_KEY !== query.interactivePublicKey) {
      throw "Provided public key does not match";
    }

    return {
      assetId: query.assetId,
      displayName: query.displayName,
      identityId: query.identityId,
      interactiveNonce: query.interactiveNonce,
      interactivePublicKey: query.interactivePublicKey,
      profileId: query.profileId,
      sceneDropId: query.sceneDropId,
      uniqueName: query.uniqueName,
      urlSlug: query.urlSlug,
      username: query.username,
      visitorId: query.visitorId,
    };
  } catch (error) {
    return logger.error({
      error,
      functionName: "getCredentials",
      message: "Error getting credentials from query.",
    });
  }
};
