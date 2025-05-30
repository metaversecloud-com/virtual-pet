import { IVisitor, PetStatusType } from "../types";
import { level } from "../constants";
import { errorHandler } from "./errorHandler";

export const grantExpression = async ({
  profileId,
  visitor,
  petStatus,
  newExperience,
}: {
  profileId: string;
  visitor: IVisitor;
  petStatus: PetStatusType;
  newExperience: number;
}) => {
  try {
    const { experience, petType } = petStatus;

    if (newExperience >= level[5] && (!experience || experience < level[5])) {
      const expressionName = `pet_${petType}`;
      const grantExpressionResponse = await visitor.grantExpression({
        name: expressionName,
      });

      let title, text;

      if (grantExpressionResponse?.success) {
        title = "🔎 New Emote Unlocked";
        text = "🌟 Congratulations! You just unlocked a new emote!";
        visitor
          .triggerParticle({
            name: "whiteStar_burst",
            duration: 7,
          })
          .catch((error) =>
            errorHandler({
              error,
              functionName: "grantExpression",
              message: "Error triggering particle effects",
            }),
          );

        visitor
          .updateDataObject(
            {},
            {
              analytics: [
                {
                  analyticName: `${expressionName}-emoteUnlocked`,
                  // uniqueKey: profileId,
                  profileId,
                },
              ],
            },
          )
          .then()
          .catch(() => console.error("Error analytics when granting expressions"));
      } else {
        title = `🌟 Congratulations! You've leveled up!`;
        text = "You've already collected this reward. Trade in your pet to start over and collect a new emote!";
      }

      visitor
        .fireToast({
          groupId: "VirtualPetExpression",
          title,
          text,
        })
        .catch((error) =>
          errorHandler({
            error,
            functionName: "grantExpression",
            message: "Error firing toast",
          }),
        );
    }
  } catch (error) {
    return errorHandler({
      error,
      functionName: "grantExpression",
      message: "Error granting expression",
    });
  }
};
