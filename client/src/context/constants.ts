import { defaultPetStatus } from "@/constants";

export const initialState = {
  error: "",
  isAdmin: false,
  isPetOwner: false,
  petStatus: defaultPetStatus,
  hasInteractiveParams: false,
  hasSetupBackend: false,
};

export const initialPetState = {
  isFeeding: false,
  isSleeping: false,
  isTraining: false,
  isPlaying: false,
  isNotHungry: false,
  isNotSleepy: false,
  dontWantToTrain: false,
  dontWantToPlay: false,
  isLoading: false,
};

export const FEED = "FEED";
export const SLEEP = "SLEEP";
export const PLAY = "PLAY";
export const TRAIN = "TRAIN";

export const DELAY = 5000;
