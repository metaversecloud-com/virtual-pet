const levels: Record<number, number> = {
  1: 100,
  2: 300,
  3: 600,
  4: 1000,
  5: 1500,
  6: 2100,
  7: 2800,
  8: 3600,
  9: 4500,
  10: 5500,
  11: 6600,
  12: 7800,
  13: 9100,
  14: 10500,
  15: 12000,
  16: 13600,
  17: 15300,
  18: 17100,
  19: 19000,
  20: 21000,
  21: 23100,
  22: 25300,
  23: 27600,
  24: 30000,
  25: 32500,
  26: 35100,
  27: 37800,
  28: 40600,
  29: 43500,
  30: 46500,
  31: 49600,
};

export const getLevelAndAge = (experience: number) => {
  const numberOfLevels = Object.keys(levels).length;
  for (let i = 1; i < numberOfLevels; i++) {
    if (experience < levels[i]) {
      const currentLevel = i;
      return {
        currentLevel,
        experienceNeededForNextLevel: levels[i],
        experienceNeededForTheLevelYouCurrentlyAchieved: i == 1 ? 0 : levels[i - 1],
        petAge: currentLevel < 5 ? "baby" : currentLevel < 10 ? "teen" : "adult",
      };
    }
  }

  return {
    currentLevel: numberOfLevels,
    experienceNeededForNextLevel: numberOfLevels - 1,
    experienceNeededForTheLevelYouCurrentlyAchieved: numberOfLevels,
    petAge: "adult",
  };
};
