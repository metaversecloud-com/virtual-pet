import { DroppedAsset } from "@rtsdk/topia";

export interface IDroppedAsset extends DroppedAsset {
  dataObject?: {
    profileId?: string;
  };
}
