import { BadgesType, PetStatusType, VisitorInventoryType } from "../../../shared/types.js";

export const SET_HAS_SETUP_BACKEND = "SET_HAS_SETUP_BACKEND";
export const SET_INTERACTIVE_PARAMS = "SET_INTERACTIVE_PARAMS";
export const SET_GAME_STATE = "SET_GAME_STATE";
export const SET_ERROR = "SET_ERROR";
export const SET_KEY_ASSET_ID = "SET_KEY_ASSET_ID";
export const SET_SELECTED_PET = "SET_SELECTED_PET";

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
  isPetOwner?: boolean;
  petStatus?: PetStatusType;
  error?: string;
  hasInteractiveParams?: boolean;
  hasSetupBackend?: boolean;
  pets?: { [key: string]: PetStatusType };
  selectedPetId?: string;
  badges?: BadgesType;
  visitorInventory?: VisitorInventoryType;
}

export type ActionType = {
  type: string;
  payload: InitialStateType;
};
