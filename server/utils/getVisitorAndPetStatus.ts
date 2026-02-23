import { Credentials, IVisitor, PetStatusType, VisitorInventoryType } from "../types/index.js";
import { convertPetToPets, standardizeError, Visitor } from "./index.js";

export const getVisitorAndPetStatus = async (
  credentials: Credentials,
): Promise<{
  isAdmin: boolean;
  pets: Record<string, PetStatusType>;
  visitor: IVisitor;
  visitorInventory: VisitorInventoryType;
  selectedPetId?: string;
  petStatus?: PetStatusType;
  isPetOwner?: boolean;
  petVisitorPosition?: { x: number; y: number };
}> => {
  try {
    const { urlSlug, visitorId } = credentials;

    const visitor = (await Visitor.get(visitorId, urlSlug, { credentials })) as IVisitor;
    const { isAdmin = false } = visitor;

    await visitor.fetchDataObject();

    await visitor.fetchInventoryItems();
    let visitorInventory: VisitorInventoryType = { badges: {}, npcs: {} };

    for (const visitorItem of visitor.inventoryItems) {
      const { id, status, item } = visitorItem;
      const { id: ecosystemItemId, name, type, image_url = "", metadata } = item || {};
      const { petDescription } = (metadata as { petDescription: string }) || {};

      if (status === "ACTIVE") {
        if (type === "BADGE") {
          visitorInventory.badges[name] = {
            id,
            icon: image_url,
            name,
          };
        } else if (type === "NPC") {
          visitorInventory.npcs[name] = {
            id,
            ecosystemItemId,
            name,
            petDescription,
          };
        }
      }
    }

    if (!visitor.dataObject?.pet && !visitor.dataObject?.pets) {
      await visitor.setDataObject({ pets: {} });

      return {
        isAdmin,
        pets: {},
        visitor,
        visitorInventory,
      };
    }

    if (visitor.dataObject.pet) {
      const pets = convertPetToPets(visitor.dataObject.pet);

      visitor.dataObject.pets = pets;
      delete visitor.dataObject.pet;

      await visitor.setDataObject({ pets });
    }

    const petVisitor = (await visitor.getNpc()) as { isNPCFromKey: string; moveTo: { x: number; y: number } } | null;

    // Find the pet in world by matching petDescription and id of the NPC
    let selectedPetId;
    // Build a map of petDescription to npc id
    const npcDescToId = Object.values(visitorInventory.npcs).reduce(
      (acc, npc) => {
        acc[npc.petDescription] = npc.id;
        return acc;
      },
      {} as Record<string, string>,
    );
    for (const [petKey, pet] of Object.entries(visitor.dataObject.pets)) {
      const { petType, petAge, color = "" } = pet;
      const description = `${petType}:${petAge}:${color}`;
      const npcId = npcDescToId[description];
      if (npcId && petVisitor?.isNPCFromKey.includes(npcId)) {
        selectedPetId = petKey;
        visitor.dataObject.pets[petKey].isPetInWorld = true;
      } else {
        visitor.dataObject.pets[petKey].isPetInWorld = false;
      }
    }

    return {
      isAdmin,
      pets: visitor.dataObject.pets,
      visitor,
      visitorInventory,
      selectedPetId,
      petStatus: selectedPetId ? visitor.dataObject.pets[selectedPetId] : undefined,
      isPetOwner: selectedPetId ? !!visitor.dataObject.pets[selectedPetId] : false,
      petVisitorPosition: petVisitor ? petVisitor.moveTo : undefined,
    };
  } catch (error) {
    throw standardizeError(error);
  }
};
