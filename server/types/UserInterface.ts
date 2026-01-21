import { User, Visitor } from "@rtsdk/topia";
import { PetStatusType } from "../../shared/types.js";

export { PetStatusType };

export interface IUser extends User {
  dataObject?: {
    pet?: PetStatusType; // Deprecated: use pets instead to allow for multiple pets
    pets: {
      [key: string]: PetStatusType;
    };
  };
}

export interface IVisitor extends Visitor {
  isAdmin?: boolean;
  dataObject?: {
    pet?: PetStatusType; // Deprecated: use pets instead to allow for multiple pets
    pets: {
      [key: string]: PetStatusType;
    };
  };
}
