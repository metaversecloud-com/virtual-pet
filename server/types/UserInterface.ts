import { User, Visitor } from "@rtsdk/topia";

export type PetStatusType = {
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
  feed: { timestamp?: number };
  sleep: { timestamp?: number };
  play: { timestamp?: number };
  train: { timestamp?: number };
};

export interface IUser extends User {
  dataObject?: {
    pet?: PetStatusType;
  };
}

export interface IVisitor extends Visitor {
  isAdmin?: boolean;
  dataObject?: {
    pet?: PetStatusType;
  };
}
