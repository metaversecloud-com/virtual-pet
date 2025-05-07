/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visitor: null,
  droppedAsset: null,
  error: null,
  pet: null,
  keyAssetId: null,
  isPetAssetOwner: false,
  petState: {
    isFeeding: false,
    isSleeping: false,
    isTraining: false,
    isPlaying: false,
    isNotHungry: false,
    isNotSleepy: false,
    dontWantToTrain: false,
    dontWantToPlay: false,
    isLoading: false,
    wandIsDisabled: false,
  },
};

const reducers = {
  setVisitor: (state, action) => {
    state.visitor = action.payload;
  },
  setDroppedAsset: (state, action) => {
    state.droppedAsset = action.payload;
  },
  setPet: (state, action) => {
    state.pet = action.payload;
  },
  setKeyAssetId: (state, action) => {
    state.keyAssetId = action.payload;
  },
  setError: (state, action) => {
    state.error = action.payload;
  },
  setPetAssetOwner: (state, action) => {
    state.isPetAssetOwner = action.payload;
  },
  setPetState: (state, action) => {
    state.petState = { ...state.petState, ...action.payload };
  },
  setPetInWorld: (state, action) => {
    state.pet.isPetInWorld = action.payload;
  },
};

export const session = createSlice({
  name: "session",
  initialState,
  reducers,
});
