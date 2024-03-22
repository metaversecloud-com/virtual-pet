let level = [];
// Level 1 has 0 exp to 100 exp

level[0] = 100; // Level 2 has 100 exp to 300 exp
level[1] = 300;
level[2] = 600;
level[3] = 1000; // Level 5 has 1000 exp to 1500 exp
level[4] = 1500;
level[5] = 2100;
level[6] = 2800;
level[7] = 3600;
level[8] = 4500; // Level 10 has 4500 exp to 5500 exp
level[9] = 5500;
level[10] = 6600;
level[11] = 7800;
level[12] = 9100;
level[13] = 10500;
level[14] = 12000;
level[15] = 13600;
level[16] = 15300;
level[17] = 17100;
level[18] = 19000;
level[19] = 21000;
level[20] = 23100;
level[21] = 25300;
level[22] = 27600;
level[23] = 30000;
level[24] = 32500;
level[25] = 35100;
level[26] = 37800;
level[27] = 40600;
level[28] = 43500;
level[29] = 46500;
level[30] = 49600;

export function getLevel(experience) {
  for (let i = 0; i < level.length; i++) {
    if (experience < level[i]) {
      return {
        currentLevel: i + 1,
        experienceNeededForNextLevel: level[i],
        experienceNeededForTheLevelYouCurrentlyAchieved:
          i > 0 ? level[i - 1] : 0,
      };
    }
  }

  return {
    currentLevel: level.length,
    experienceNeededForNextLevel: level[level.length - 1],
  };
}

export const getS3URL = () => {
  return `https://${
    process.env.S3_BUCKET || "sdk-virtual-pet"
  }.s3.amazonaws.com`;
};
