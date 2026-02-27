import { getS3URL } from "@/utils";
export { defaultPetStatus } from "../../shared/constants.js";

const baby = {
  beingFedMessage: "So Yummy!!",
  notHungryMessage: "I'm not hungry.",
};
const teen = {
  beingFedMessage: "Yum! Thanks for feeding me!!",
  notHungryMessage: "I don't want to eat right now.",
};
const adult = {
  beingFedMessage: "So great! Thanks!",
  notHungryMessage: "I'm not hungry right now.",
};

const dragon = {
  baby: {
    ...baby,
    petDescription: "Baby Dragon",
  },
  teen: {
    ...teen,
    petDescription: "Teen Dragon",
  },
  adult: {
    ...adult,
    petDescription: "Adult Dragon",
  },
};

const penguin = {
  baby: {
    ...baby,
    petDescription: "Baby Penguin",
  },
  teen: {
    ...teen,
    petDescription: "Teen Penguin",
  },
  adult: {
    ...adult,
    petDescription: "Adult Penguin",
  },
};

const unicorn = {
  baby: {
    ...baby,
    petDescription: "Baby Unicorn",
  },
  teen: {
    ...teen,
    petDescription: "Teen Unicorn",
  },
  adult: {
    ...adult,
    petDescription: "Adult Unicorn",
  },
};

const dog = {
  baby: {
    ...baby,
    petDescription: "Puppy",
  },
  teen: {
    ...teen,
    petDescription: "Teen Dog",
  },
  adult: {
    ...adult,
    petDescription: "Adult Dog",
  },
};

const cat = {
  baby: {
    ...baby,
    petDescription: "Kitten",
  },
  teen: {
    ...teen,
    petDescription: "Teen Cat",
  },
  adult: {
    ...adult,
    petDescription: "Adult Cat",
  },
};

export const petData = { dragon, penguin, unicorn, dog, cat };

export const pets = [
  {
    id: 0,
    name: "Dragon",
    petType: "dragon",
    description: "A mystical, fire-breathing creature that soars through the skies.",
    image: `${getS3URL()}/assets/dragon/normal/baby-color-0.png`,
  },
  {
    id: 1,
    name: "Penguin",
    petType: "penguin",
    description: "A playful bird with striking patterns that swims but does not fly!",
    image: `${getS3URL()}/assets/penguin/normal/baby-color-0.png`,
  },
  {
    id: 2,
    name: "Unicorn",
    petType: "unicorn",
    description: "A magical and majestic creature that is difficult to catch.",
    image: `${getS3URL()}/assets/unicorn/normal/baby-color-0.png`,
  },
  {
    id: 3,
    name: "Dog",
    petType: "dog",
    description: "A loyal and friendly companion that loves to play fetch.",
    image: `${getS3URL()}/assets/dog/normal/baby-color-0.png`,
  },
  {
    id: 4,
    name: "Cat",
    petType: "cat",
    description: "A graceful and independent companion that enjoys both play and relaxation.",
    image: `${getS3URL()}/assets/cat/normal/baby-color-0.png`,
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
  "Pixie",
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
  "Bob",
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
