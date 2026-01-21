export type VisitorInventoryType = {
  badges: { [key: string]: { id: string; icon: string; name: string } };
  npcs: { [key: string]: { id: string; ecosystemItemId: string; name: string; petDescription: string } };
};
