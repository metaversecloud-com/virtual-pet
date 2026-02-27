import { petData } from "@/constants";

type PetData = {
  [key in "dragon" | "penguin" | "unicorn" | "dog" | "cat"]: {
    [key in "baby" | "teen" | "adult"]: {
      beingFedMessage: string;
      notHungryMessage: string;
      petDescription: string;
    };
  };
};

export const getPetData = (
  petAge: "baby" | "teen" | "adult" = "baby",
  petType: "dragon" | "penguin" | "unicorn" | "dog" | "cat" = "dragon",
) => {
  return (petData as PetData)[petType][petAge];
};
