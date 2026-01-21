export type PetStatusType = {
  id: string;
  username: string;
  experience: number;
  currentLevel: number;
  experienceNeededForNextLevel: number;
  experienceNeededForTheLevelYouCurrentlyAchieved: number;
  petAge: string;
  petType: string;
  name: string;
  color: number;
  isPetInWorld: boolean;
  feed: { timestamp?: number; actionTakenCount?: number };
  sleep: { timestamp?: number; actionTakenCount?: number };
  play: { timestamp?: number; actionTakenCount?: number };
  train: { timestamp?: number; actionTakenCount?: number };
  petSpawnedDroppedAssetId?: string;
  createdDate?: string;
  lastInteractionDate?: string;
  currentStreak?: number;
  longestStreak?: number;
};

export type BadgesType = {
  [name: string]: {
    id: string;
    name: string;
    icon: string;
    description: string;
    sortOrder?: number;
  };
};

export type VisitorInventoryType = {
  badges: { [key: string]: { id: string; icon: string; name: string } };
  npcs: { [key: string]: { id: string; ecosystemItemId: string; name: string; petDescription: string } };
};
