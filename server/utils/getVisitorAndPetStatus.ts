import { Credentials, IVisitor } from "../types/index.js";
import { Ecosystem, errorHandler, getLevelAndAge, Visitor } from "./index.js";

interface InventoryItemMetadata {
  petDescription?: string;
  [key: string]: unknown;
}

/**
 * Ensures the visitor has the NPC inventory item for their current pet stage.
 * This handles migration for existing users who have pets but no inventory items.
 */
async function ensureNpcInventoryItem(
  visitor: IVisitor,
  petType: string,
  petAge: string,
  color: number,
  credentials: Credentials,
): Promise<void> {
  try {
    // Build petDescription to match inventory item metadata
    // Format: {type}:{age}:{color} (e.g., "dragon:baby:0")
    const petDescription = `${petType}:${petAge}:${color}`;

    // Fetch visitor's current inventory
    await visitor.fetchInventoryItems();
    const userInventoryItems = visitor.inventoryItems;

    // Check if user already has an NPC item matching this petDescription
    const hasMatchingItem = userInventoryItems.some((userInvItem) => {
      const itemDetails = (userInvItem as { item?: { metadata?: InventoryItemMetadata } }).item;
      return itemDetails?.metadata?.petDescription === petDescription;
    });

    if (hasMatchingItem) {
      return; // User already has this NPC item
    }

    // Fetch app's NPC inventory items to find the one to grant
    const ecosystem = Ecosystem.create({ credentials });
    await ecosystem.fetchInventoryItems();
    const appInventoryItems = ecosystem.inventoryItems;

    // Find the NPC item matching this petDescription
    const matchingNpcItem = appInventoryItems.find((item) => {
      const metadata = (item as { metadata?: InventoryItemMetadata }).metadata;
      return metadata?.petDescription === petDescription;
    });

    if (!matchingNpcItem) {
      return;
    }

    // Grant the NPC item to the visitor (pass the InventoryItem object, not just the ID)
    await visitor.grantInventoryItem(matchingNpcItem, 1);
  } catch (error) {
    // Log but don't fail the main request - this is a migration helper
    console.error("Error ensuring NPC inventory item:", error);
  }
}

export const getVisitorAndPetStatus = async (credentials: Credentials) => {
  try {
    const { urlSlug, visitorId } = credentials;

    const visitor = (await Visitor.get(visitorId, urlSlug, { credentials })) as IVisitor;

    await visitor.fetchDataObject();

    const { isAdmin } = visitor;

    if (!visitor.dataObject?.pet) {
      return {
        isAdmin,
        visitorHasPet: false,
        visitor,
      };
    }

    // this should be stored in the visitor data object moving forward but for backwards compatibility we need to also add it manually here
    const { currentLevel, experienceNeededForNextLevel, experienceNeededForTheLevelYouCurrentlyAchieved, petAge } =
      getLevelAndAge(visitor.dataObject?.pet?.experience || 0);

    // Ensure user has the NPC inventory item for their current pet stage (migration for existing users)
    const { petType, color } = visitor.dataObject.pet;
    if (petType !== undefined && color !== undefined) {
      await ensureNpcInventoryItem(visitor, petType, petAge, color, credentials);
    }

    const petVisitor = await visitor.getNpc();

    return {
      isAdmin,
      petStatus: {
        ...visitor.dataObject?.pet,
        currentLevel,
        experienceNeededForNextLevel,
        experienceNeededForTheLevelYouCurrentlyAchieved,
        petAge,
      },
      visitorHasPet: true,
      visitor,
      petVisitor,
    };
  } catch (error) {
    return errorHandler({
      error,
      functionName: "getVisitorAndPetStatus",
      message: "Error getting visitor and pet status",
    });
  }
};
