import { getLevelAndAge } from "./index.js";

export const convertPetToPets = (pet: any) => {
  const { experience, petType, createdDate } = pet;
  // this should be stored in the visitor data object moving forward but for backwards compatibility we need to also add it manually here
  const { currentLevel, experienceNeededForNextLevel, experienceNeededForTheLevelYouCurrentlyAchieved, petAge } =
    getLevelAndAge(experience || 0);

  const id = `${petType}_${createdDate}`;
  const pets = {
    [`${petType}_${createdDate}`]: {
      ...pet,
      id,
      currentLevel,
      experienceNeededForNextLevel,
      experienceNeededForTheLevelYouCurrentlyAchieved,
      petAge,
    },
  };

  return pets;
};
