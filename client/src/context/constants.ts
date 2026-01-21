import { defaultPetStatus } from "@/constants";

export const initialState = {
  error: "",
  isAdmin: false,
  isPetOwner: false,
  petStatus: defaultPetStatus,
  hasInteractiveParams: false,
  hasSetupBackend: false,
};
