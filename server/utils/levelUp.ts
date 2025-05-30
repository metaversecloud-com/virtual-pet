import { level } from "../constants.js";
import { IVisitor } from "../types/index.js";
import { errorHandler } from "./errorHandler.js";

export const levelUp = async ({
  experience,
  newExperience,
  visitor,
}: {
  experience: number;
  newExperience: number;
  visitor: IVisitor;
}) => {
  const level3 = level[3];
  const level8 = level[8];

  if (
    (newExperience >= level3 && (!experience || experience < level3)) ||
    (newExperience >= level8 && (!experience || experience < level8))
  ) {
    visitor
      .triggerParticle({
        name: "medal_float",
        duration: 7,
      })
      .catch((error: any) =>
        errorHandler({
          error,
          functionName: "levelUp",
          message: "Error triggering particle effects",
        }),
      );
    return true;
  }
  return false;
};
