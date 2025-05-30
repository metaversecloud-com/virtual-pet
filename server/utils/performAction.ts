import { ACTION_COOLDOWNS, ACTION_EXPERIENCE_GAIN, ACTION_PARTICLE_EFFECTS } from "../constants";
import { PetStatusType } from "../types";
import { errorHandler } from "./errorHandler";

export const performAction = async ({
  petStatus,
  actionKey,
}: {
  petStatus: Record<keyof PetStatusType, any>;
  actionKey: keyof typeof ACTION_PARTICLE_EFFECTS;
}) => {
  try {
    const now = Date.now();
    const cooldown = ACTION_COOLDOWNS[actionKey];
    const experienceGain = ACTION_EXPERIENCE_GAIN[actionKey];

    const actionObj = petStatus[actionKey.toLowerCase() as keyof PetStatusType] || { timestamp: 0 };

    const timeSinceLastAction = now - cooldown;
    if (actionObj.timestamp && timeSinceLastAction < cooldown) return { petStatus };

    return {
      ...petStatus,
      experience: (petStatus.experience || 0) + experienceGain,
      [actionKey.toLowerCase()]: { timestamp: now },
    };
  } catch (error) {
    return errorHandler({
      error,
      functionName: "performAction",
      message: "Error performing action",
    });
  }
};
