import { createContext } from "react";
import { ActionType, InitialStateType } from "./types";
import { initialState } from "./constants";

export const GlobalStateContext = createContext<InitialStateType>(initialState);

export const GlobalDispatchContext = createContext<React.Dispatch<ActionType> | null>(null);
