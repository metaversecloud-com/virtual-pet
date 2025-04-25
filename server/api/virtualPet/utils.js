import { World, Visitor } from "../topiaInit.js";

export let level = [];
level[0] = 100;
level[1] = 300;
level[2] = 600;
level[3] = 1000;
level[4] = 1500;
level[5] = 2100;
level[6] = 2800;
level[7] = 3600;
level[8] = 4500;
level[9] = 5500;
level[10] = 6600;
level[11] = 7800;
level[12] = 9100;
level[13] = 10500;
level[14] = 12000;
level[15] = 13600;
level[16] = 15300;
level[17] = 17100;
level[18] = 19000;
level[19] = 21000;
level[20] = 23100;
level[21] = 25300;
level[22] = 27600;
level[23] = 30000;
level[24] = 32500;
level[25] = 35100;
level[26] = 37800;
level[27] = 40600;
level[28] = 43500;
level[29] = 46500;
level[30] = 49600;

export function getLevel(experience) {
  for (let i = 0; i < level.length; i++) {
    if (experience < level[i]) {
      return {
        currentLevel: i + 1,
        experienceNeededForNextLevel: level[i],
        experienceNeededForTheLevelYouCurrentlyAchieved: i > 0 ? level[i - 1] : 0,
      };
    }
  }
  return {
    currentLevel: level.length,
    experienceNeededForNextLevel: level[level.length - 1],
  };
}

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
 * Determines if a pet can perform a certain action based on the time that has passed since the action was last performed (cooldown).
 */
export function canPerformAction(lastActionTime, currentTime, minTimeBetweenActions) {
  const timeSinceLastAction = currentTime - lastActionTime;
  return !(lastActionTime && timeSinceLastAction < minTimeBetweenActions);
}

export async function removeAllUserPets(urlSlug, visitor, credentials) {
  const world = await World.create(urlSlug, { credentials });

  try {
    const petAssets = await world.fetchDroppedAssetsWithUniqueName({
      uniqueName: `petSystem-${visitor?.username}`,
    });

    await deleteAllPets({
      urlSlug,
      allPetAssets: petAssets,
      credentials,
    });
  } catch (error) {
    console.error("❌ There are no pets to be deleted.", JSON.stringify(error));
  }
}

export async function deleteAllPets({ urlSlug, allPetAssets, credentials }) {
  let droppedAssetIds = [];
  for (const petAsset in allPetAssets) {
    droppedAssetIds.push(allPetAssets[petAsset].id);
  }
  await World.deleteDroppedAssets(urlSlug, droppedAssetIds, process.env.INTERACTIVE_SECRET, credentials);
}

export async function getVisitorWithDataObject({ credentials, urlSlug }) {
  const visitor = Visitor.create(credentials?.visitorId, urlSlug, { credentials });

  await Promise.all([visitor.fetchVisitor(), visitor.fetchDataObject()]);

  return visitor;
}
