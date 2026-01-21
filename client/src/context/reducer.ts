import {
  ActionType,
  InitialStateType,
  SET_ERROR,
  SET_GAME_STATE,
  SET_HAS_SETUP_BACKEND,
  SET_INTERACTIVE_PARAMS,
  SET_KEY_ASSET_ID,
  SET_IS_ADMIN,
  SET_SELECTED_PET,
} from "./types";

const globalReducer = (state: InitialStateType, action: ActionType) => {
  const { type, payload } = action;
  switch (type) {
    case SET_INTERACTIVE_PARAMS:
      return {
        ...state,
        hasInteractiveParams: true,
      };
    case SET_HAS_SETUP_BACKEND:
      return {
        ...state,
        ...payload,
        hasSetupBackend: true,
      };
    case SET_IS_ADMIN:
      return {
        ...state,
        isAdmin: action.payload.isAdmin,
        error: "",
      };
    case SET_GAME_STATE:
      return {
        ...state,
        isPetOwner: payload.isPetOwner,
        petStatus: payload.petStatus,
        pets: payload.pets,
        selectedPetId: payload.selectedPetId,
        badges: payload.badges || state.badges,
        visitorInventory: payload.visitorInventory,
        error: "",
      };
    case SET_SELECTED_PET:
      return {
        ...state,
        petStatus: payload.petStatus,
        selectedPetId: payload.selectedPetId,
        isPetOwner: true,
        error: "",
      };
    case SET_KEY_ASSET_ID:
      return {
        ...state,
        keyAssetId: payload.keyAssetId,
        error: "",
      };
    case SET_ERROR:
      return {
        ...state,
        error: payload?.error,
      };

    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
};

export { globalReducer };
