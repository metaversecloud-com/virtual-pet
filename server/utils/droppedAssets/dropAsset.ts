import { DroppedAssetClickType, VisitorInterface } from "@rtsdk/topia";
import { Credentials, PetStatusType } from "../../types/index.js";
import { Asset, DroppedAsset, errorHandler, getS3URL, removeDroppedAssets } from "../index.js";

export const dropAsset = async ({
  credentials,
  petStatus,
  visitor,
  host,
}: {
  credentials: Credentials;
  petStatus: PetStatusType;
  visitor: VisitorInterface;
  host: string;
}) => {
  try {
    const { profileId, urlSlug, username } = credentials;

    const { petType, color, currentLevel } = petStatus;

    const protocol = process.env.INSTANCE_PROTOCOL || "https";

    let BASE_URL = `${protocol}://${host}`;
    if (host === "localhost") BASE_URL = "http://localhost:3001";

    await removeDroppedAssets(credentials, `petSystem-${username}`);

    let petAge = "baby";
    if (currentLevel >= 5 && currentLevel < 10) {
      petAge = "teen";
    } else if (currentLevel >= 10) {
      petAge = "adult";
    }

    const { moveTo } = visitor;
    const position = {
      x: (moveTo?.x || 0) + 100,
      y: moveTo?.y || 0,
    };

    const asset = await Asset.create(process.env.IMG_ASSET_ID || "webImageAsset", { credentials });

    const petSpawnedDroppedAsset = await DroppedAsset.drop(asset, {
      position,
      uniqueName: `petSystem-${username}`,
      urlSlug,
      flipped: Math.random() < 0.5,
      isInteractive: true,
      interactivePublicKey: process.env.INTERACTIVE_KEY,
      layer0: "",
      layer1: `${getS3URL()}/assets/${petType}/world/${petAge}-color-${color}.png`,
      clickType: DroppedAssetClickType.LINK,
      clickableLink: `${BASE_URL}/asset-type/spawned`,
      clickableLinkTitle: "Virtual Pet",
      clickableDisplayTextDescription: "Play with your Virtual Pet",
      clickableDisplayTextHeadline: "Virtual Pet",
      isOpenLinkInDrawer: true,
    });

    await Promise.all([
      petSpawnedDroppedAsset?.updateDataObject({
        profileId,
      }),
      visitor.updateDataObject(
        {
          [`pet.petSpawnedDroppedAssetId`]: petSpawnedDroppedAsset?.id,
        },
        {},
      ),
    ]);

    return;
  } catch (error) {
    return errorHandler({
      error,
      functionName: "dropAsset",
      message: "Error dropping asset",
    });
  }
};
