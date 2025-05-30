import { Credentials } from "../../types/index.js";
import { errorHandler } from "../errorHandler.js";
import { World } from "../topiaInit.js";

export const removeDroppedAssets = async (credentials: Credentials, uniqueName: string = `petSystem-`) => {
  try {
    const { urlSlug } = credentials;

    const world = await World.create(urlSlug, { credentials });

    const droppedAssets = await world.fetchDroppedAssetsWithUniqueName({
      uniqueName,
      isPartial: true,
    });

    if (Object.keys(droppedAssets).length > 0) {
      const droppedAssetIds: string[] = [];
      for (const index in droppedAssets) {
        if (droppedAssets[index].id) droppedAssetIds.push(droppedAssets[index].id);
      }
      await World.deleteDroppedAssets(urlSlug, droppedAssetIds, process.env.INTERACTIVE_SECRET!, credentials);
    }
  } catch (error) {
    return errorHandler({
      error,
      functionName: "removeDroppedAssets",
      message: `Error retrieving assets with unique name petSystem-${credentials.username}`,
    });
  }
};
