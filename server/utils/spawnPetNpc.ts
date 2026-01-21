import { Ecosystem, standardizeError, removeDroppedAssets } from "../utils/index.js";
import { Credentials } from "../types/Credentials.js";
import { VisitorInterface } from "@rtsdk/topia";
import { VisitorInventoryType } from "../types/VisitorTypes.js";
import { PetStatusType } from "../types/UserInterface.js";

interface InventoryItemMetadata {
  petDescription?: string;
  spriteUrl?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

export const spawnPetNpc = async ({
  credentials,
  visitor,
  visitorInventory,
  petStatus,
}: {
  credentials: Credentials;
  visitor: VisitorInterface;
  visitorInventory: VisitorInventoryType;
  petStatus: PetStatusType;
}): Promise<{ success: boolean } | Error> => {
  try {
    await visitor.deleteNpc();
    await removeDroppedAssets(credentials, `petSystem-${credentials.username}`);

    const { petType, color, currentLevel } = petStatus;

    // Build petDescription to match inventory item metadata
    // Format: {type}:{age}:{color} (e.g., {"petDescription":"dragon:baby:0"})
    const petAge = currentLevel < 5 ? "baby" : currentLevel < 10 ? "teen" : "adult";
    const petDescription = `${petType}:${petAge}:${color}`;

    // Fetch app's NPC inventory items
    const ecosystem = Ecosystem.create({ credentials });
    await ecosystem.fetchInventoryItems();
    const appInventoryItems = ecosystem.inventoryItems;

    // Find the NPC inventory item matching this pet's description
    const matchingItem = appInventoryItems.find((item) => {
      const metadata = (item as { metadata?: InventoryItemMetadata }).metadata;
      return metadata?.petDescription === petDescription;
    });

    if (!matchingItem) {
      throw new Error(`No NPC inventory item found for petDescription: ${petDescription}`);
    }

    // Find the user's inventory item that references the matching NPC item
    let userItemId = Object.values(visitorInventory.npcs).find(
      (item: any) => item.ecosystemItemId === matchingItem.id,
    )?.id;

    if (!userItemId) {
      await visitor.grantInventoryItem(matchingItem, 1);
      await visitor.fetchInventoryItems();
      userItemId = Object.values(visitor.inventoryItems).find((item: any) => item.itemId === matchingItem.id)?.id;
    }

    if (!userItemId) {
      throw new Error(`Failed to grant or obtain user inventory item for ecosystemItemId: ${matchingItem.id}`);
    }

    // Create NPC using the user's inventory item id (without nameplate)
    await visitor.createNpc(userItemId, { showNameplate: false });

    return { success: true };
  } catch (error) {
    return standardizeError(error);
  }
};
