import { ActionType, PetStatusType, SET_GAME_STATE } from "@/context/types";
import { Dispatch } from "react";

export const setGameState = (
  dispatch: Dispatch<ActionType> | null,
  gameState: { isPetAssetOwner: boolean; isPetInWorld: boolean; petStatus: PetStatusType; isAdmin: boolean },
) => {
  if (!dispatch || !setGameState) return;

  dispatch({
    type: SET_GAME_STATE,
    payload: { ...gameState, error: "" },
  });
};
