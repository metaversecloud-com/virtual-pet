import { DroppedAssetClickType, VisitorInterface } from "@rtsdk/topia";
import { Credentials, PetStatusType } from "./../types/index.js";
import { Asset, DroppedAsset, errorHandler, getS3URL, removeDroppedAssets } from "./index.js";

export const petFollowMe = async ({
  credentials,
  petStatus,
  visitor,
}: {
  credentials: Credentials;
  petStatus: PetStatusType;
  visitor: VisitorInterface;
}) => {
  try {
    const { username } = credentials;

    const { petType, color, currentLevel, name } = petStatus;

    await removeDroppedAssets(credentials, `petSystem-${username}`);

    const petAge = currentLevel < 5 ? "baby" : currentLevel < 10 ? "teen" : "adult";
    const petSize = currentLevel < 5 ? 50 : currentLevel < 10 ? 70 : 90;

    const petVisitor = await visitor.addFollowingAvatar(
      `${name} - ${username}'s pet`,
      `${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`,
      petSize,
      petSize,
    );

    return petVisitor;
  } catch (error) {
    return errorHandler({
      error,
      functionName: "petFollowMe",
      message: "Error making pet follow me",
    });
  }
};
