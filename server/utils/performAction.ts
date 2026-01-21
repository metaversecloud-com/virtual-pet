import { ACTION_COOLDOWNS, ACTION_EXPERIENCE_GAIN } from "../constants.js";
import { PetStatusType } from "../types/index.js";
import { standardizeError } from "./standardizeError.js";

export const performAction = async ({
  petStatus,
  actionKey,
}: {
  petStatus: PetStatusType;
  actionKey: string & keyof PetStatusType;
}): Promise<PetStatusType | Error> => {
  try {
    const now = Date.now();
    const cooldown = ACTION_COOLDOWNS[actionKey.toUpperCase() as keyof typeof ACTION_COOLDOWNS];
    const experienceGain = ACTION_EXPERIENCE_GAIN[actionKey.toUpperCase() as keyof typeof ACTION_EXPERIENCE_GAIN];

    const actionObj = petStatus[actionKey] || {
      timestamp: 0,
      actionTakenCount: 0,
    };

    let lastTimestamp = 0;
    if (typeof actionObj === "object" && "timestamp" in actionObj && typeof actionObj.timestamp === "number") {
      lastTimestamp = actionObj.timestamp;
    }

    const timeSinceLastAction = now - lastTimestamp;
    if (lastTimestamp && timeSinceLastAction < cooldown) return petStatus;

    let actionCount = 0;
    if (
      typeof actionObj === "object" &&
      "actionTakenCount" in actionObj &&
      typeof actionObj.actionTakenCount === "number"
    ) {
      actionCount = actionObj.actionTakenCount;
    }
    actionCount += 1;

    return {
      ...petStatus,
      experience: (petStatus.experience || 0) + experienceGain,
      [actionKey]: { timestamp: now, actionTakenCount: actionCount },
    };
  } catch (error) {
    return standardizeError(error);
  }
};
