import { VisitorInterface } from "@rtsdk/topia";
import { Credentials, PetStatusType } from "./../types/index.js";
import { Ecosystem, errorHandler, removeDroppedAssets } from "./index.js";

interface InventoryItemMetadata {
  petDescription?: string;
  spriteUrl?: string;
  width?: number;
  height?: number;
  [key: string]: unknown;
}

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

    const { petType, color, currentLevel } = petStatus;

    await removeDroppedAssets(credentials, `petSystem-${username}`);

    // Build petDescription to match inventory item metadata
    // Format: {type}:{age}:{color} (e.g., "dragon:baby:0")
    const petAge = currentLevel < 5 ? "baby" : currentLevel < 10 ? "child" : "adult";
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

    // Fetch visitor's inventory to find their UserInventoryItem for this NPC
    await visitor.fetchInventoryItems();
    const userInventoryItems = visitor.inventoryItems;

    // Find the user's inventory item that references the matching NPC item
    const userItem = userInventoryItems.find((userInvItem) => {
      // UserInventoryItem has an `item` property with the inventory item details
      const itemDetails = (userInvItem as { item?: { id?: string } }).item;
      return itemDetails?.id === (matchingItem as { id?: string }).id;
    });

    if (!userItem) {
      throw new Error(`User does not own NPC inventory item for petDescription: ${petDescription}`);
    }

    // Create NPC using the user's inventory item ID (without nameplate)
    const petVisitor = await visitor.createNpc(userItem.id, { showNameplate: false });

    return petVisitor;
  } catch (error) {
    return errorHandler({
      error,
      functionName: "petFollowMe",
      message: "Error making pet follow me",
    });
  }
};
