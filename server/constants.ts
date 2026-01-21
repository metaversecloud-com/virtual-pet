export { defaultPetStatus } from "../shared/constants.js";

export const level = {
  0: 100,
  1: 300,
  2: 600,
  3: 1000,
  4: 1500,
  5: 2100,
  6: 2800,
  7: 3600,
  8: 4500,
  9: 5500,
  10: 6600,
  11: 7800,
  12: 9100,
  13: 10500,
  14: 12000,
  15: 13600,
  16: 15300,
  17: 17100,
  18: 19000,
  19: 21000,
  20: 23100,
  21: 25300,
  22: 27600,
  23: 30000,
  24: 32500,
  25: 35100,
  26: 37800,
  27: 40600,
  28: 43500,
  29: 46500,
  30: 49600,
};

export const ACTION_COOLDOWNS = {
  PLAY: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 15,
  SLEEP: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 45,
  FEED: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 60 * 1,
  TRAIN: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 30,
};

export const ACTION_EXPERIENCE_GAIN = {
  PLAY: 5,
  SLEEP: process.env.IS_LOCALHOST ? 200 : 15,
  FEED: process.env.IS_LOCALHOST ? 500 : 20,
  TRAIN: 10,
};

export const ACTION_PARTICLE_EFFECTS = {
  SLEEP: "sleep_float",
  PLAY: "guitar_float",
  FEED: "redHeart_float",
  TRAIN: "pawPrint_float",
};
