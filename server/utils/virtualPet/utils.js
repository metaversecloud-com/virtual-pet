import { World } from "../topiaInit.js";

export async function isPetInWorld(urlSlug, visitor, credentials) {
  const world = await World.create(urlSlug, { credentials });
  let petAssets = null;
  try {
    petAssets = await world.fetchDroppedAssetsWithUniqueName({
      uniqueName: `petSystem-${visitor?.username}`,
    });
  } catch (error) {
    console.error("❌ Error in isPetInWorld function", JSON.stringify(error));
  }

  if (visitor?.dataObject?.pet) {
    return !!(petAssets && petAssets.length);
  }

  return false;
}

/**
 * Determines if a pet can perform a certain action based on the time that has passed since the action was last performed.
 *
 * @param {number} lastActionTime - The timestamp of when the action was last performed.
 * @param {number} currentTime - The current timestamp.
 * @param {number} minTimeBetweenActions - The minimum amount of time (in milliseconds) that should pass between two instances of the action.
 *
 * @returns {boolean} Returns true if enough time has passed since the last action (i.e., the difference between the current time and the last action time is greater than or equal to the minimum time between actions), otherwise returns false.
 *
 * @example
 * const currentTime = Date.now();
 * const lastPlayTime = pet.play.timestamp;
 *
 * if (!canPerformAction(lastPlayTime, currentTime, FIFTEEN_MINUTES_IN_MS)) {
 *   // Handle the case where the pet cannot perform the action
 * }
 */
export function canPerformAction(
  lastActionTime,
  currentTime,
  minTimeBetweenActions
) {
  const timeSinceLastAction = currentTime - lastActionTime;
  return !(lastActionTime && timeSinceLastAction < minTimeBetweenActions);
}
