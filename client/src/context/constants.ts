import { defaultPetStatus } from "@/constants";

export const initialState = {
  error: "",
  isAdmin: false,
  visitorHasPet: false,
  isPetAssetOwner: false,
  isPetInWorld: false,
  petStatus: defaultPetStatus,
  hasInteractiveParams: false,
  hasSetupBackend: false,
};
