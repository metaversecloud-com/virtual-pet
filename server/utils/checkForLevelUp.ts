import { level } from "../constants.js";
import { IVisitor } from "../types/index.js";
import { errorHandler } from "./errorHandler.js";
import { grantExpression } from "./grantExpression.js";

export const checkForLevelUp = async ({
  currentLevel,
  updatedLevel,
  visitor,
  petType,
}: {
  currentLevel: number;
  updatedLevel: number;
  visitor: IVisitor;
  petType: string;
}) => {
  let didLevelUp = false;
  if (updatedLevel >= 5 && currentLevel < 4) {
    didLevelUp = true;
    grantExpression({
      visitor,
      petType,
    });
  }
  if (updatedLevel >= 10 && currentLevel < 9) {
    didLevelUp = true;
  }
  if (didLevelUp) {
    visitor
      .triggerParticle({
        name: "medal_float",
        duration: 7,
      })
      .catch((error: any) =>
        errorHandler({
          error,
          functionName: "checkForLevelUp",
          message: "Error triggering particle effects",
        }),
      );
  }
  return didLevelUp;
};
