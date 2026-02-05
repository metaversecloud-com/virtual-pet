export { defaultPetStatus } from "../../shared/constants.js";

import dragonImg from "@/assets/dragon/normal/baby.png";
import penguinImg from "@/assets/penguin/normal/baby.png";
import unicornImg from "@/assets/unicorn/normal/baby.png";

const dragon = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby Dragon",
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen Dragon",
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult Dragon",
  },
};

const penguin = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby Penguin",
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen Penguin",
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult Penguin",
  },
};

const unicorn = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby Unicorn",
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen Unicorn",
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult Unicorn",
  },
};

export const petData = { dragon, penguin, unicorn };

export const pets = [
  {
    id: 0,
    name: "Dragon",
    petType: "dragon",
    description: "A mystical, fire-breathing creature that soars through the skies.",
    image: dragonImg,
  },
  {
    id: 1,
    name: "Penguin",
    petType: "penguin",
    description: "A playful bird with striking patterns that swims but does not fly!",
    image: penguinImg,
  },
  {
    id: 2,
    name: "Unicorn",
    petType: "unicorn",
    description: "A magical and majestic creature that is difficult to catch.",
    image: unicornImg,
  },
];

export const petNames = [
  "Max",
  "Luna",
  "Charlie",
  "Bella",
  "Cooper",
  "Daisy",
  "Milo",
  "Lucy",
  "Buddy",
  "Lily",
  "Maple",
  "Ace",
  "Churro",
  "Sunny",
  "Mochi",
  "Juno",
  "Scout",
  "Coco",
  "Ollie",
  "Riley",
  "Ziggy",
  "Rex",
];

export const petColors = [
  {
    id: 0,
    color: 0,
  },
  {
    id: 1,
    minLevelToUnlock: 2,
    color: 1,
  },
  {
    id: 2,
    minLevelToUnlock: 3,
    color: 2,
  },
  {
    id: 3,
    minLevelToUnlock: 4,
    color: 3,
  },
];
