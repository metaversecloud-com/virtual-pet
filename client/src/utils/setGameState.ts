import { Dispatch } from "react";
import { ActionType, SET_GAME_STATE } from "@/context/types";
import { PetStatusType } from "../../../shared/types.js";

export const setGameState = (
  dispatch: Dispatch<ActionType> | null,
  gameState: { isPetOwner: boolean; petStatus: PetStatusType; isAdmin: boolean },
) => {
  if (!dispatch || !setGameState) return;

  dispatch({
    type: SET_GAME_STATE,
    payload: { ...gameState, error: "" },
  });
};
