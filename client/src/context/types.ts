export const SET_HAS_SETUP_BACKEND = "SET_HAS_SETUP_BACKEND";
export const SET_INTERACTIVE_PARAMS = "SET_INTERACTIVE_PARAMS";
export const SET_IS_ADMIN = "SET_IS_ADMIN";
export const SET_GAME_STATE = "SET_GAME_STATE";
export const SET_ERROR = "SET_ERROR";
export const SET_PET_IN_WORLD = "SET_PET_IN_WORLD";
export const SET_KEY_ASSET_ID = "SET_KEY_ASSET_ID";

export type InteractiveParams = {
  assetId: string;
  displayName: string;
  identityId: string;
  interactiveNonce: string;
  interactivePublicKey: string;
  profileId: string;
  sceneDropId: string;
  uniqueName: string;
  urlSlug: string;
  username: string;
  visitorId: string;
};

export interface InitialStateType {
  keyAssetId?: string;
  isAdmin?: boolean;
  visitorHasPet?: boolean;
  isPetAssetOwner?: boolean;
  isPetInWorld?: boolean;
  petStatus?: PetStatusType;
  error?: string;
  hasInteractiveParams?: boolean;
  hasSetupBackend?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  petVisitor?: any;
}

export type ActionType = {
  type: string;
  payload: InitialStateType;
};

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
