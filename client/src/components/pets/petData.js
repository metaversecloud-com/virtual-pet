import dragonBabyImgPathNeutral from "../../assets/dragon/normal/baby.png";
import dragonTeenImgPathNeutral from "../../assets/dragon/normal/teen.png";
import dragonAdultImgPathNeutral from "../../assets/dragon/normal/adult.png";

import dragonBabyImgPathSmiling from "../../assets/dragon/normal/baby.png";
import dragonTeenImgPathSmiling from "../../assets/dragon/normal/teen.png";
import dragonAdultImgPathSmiling from "../../assets/dragon/normal/adult.png";

import penguinBabyImgPathNeutral from "../../assets/penguin/normal/baby.png";
import penguinTeenImgPathNeutral from "../../assets/penguin/normal/teen.png";
import penguinAdultImgPathNeutral from "../../assets/penguin/normal/adult.png";

import penguinBabyImgPathSmiling from "../../assets/penguin/normal/baby.png";
import penguinTeenImgPathSmiling from "../../assets/penguin/normal/teen.png";
import penguinAdultImgPathSmiling from "../../assets/penguin/normal/adult.png";

import unicornBabyImgPathNeutral from "../../assets/unicorn/normal/baby.png";
import unicornTeenImgPathNeutral from "../../assets/unicorn/normal/teen.png";
import unicornAdultImgPathNeutral from "../../assets/unicorn/normal/adult.png";

import unicornBabyImgPathSmiling from "../../assets/unicorn/normal/baby.png";
import unicornTeenImgPathSmiling from "../../assets/unicorn/normal/teen.png";
import unicornAdultImgPathSmiling from "../../assets/unicorn/normal/adult.png";

const dragon = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby Dragon",
    imgPathNeutral: dragonBabyImgPathNeutral,
    imgPathSmiling: dragonBabyImgPathSmiling,
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen Dragon",
    imgPathNeutral: dragonTeenImgPathNeutral,
    imgPathSmiling: dragonTeenImgPathSmiling,
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult Dragon",
    imgPathNeutral: dragonAdultImgPathNeutral,
    imgPathSmiling: dragonAdultImgPathSmiling,
  },
};

const penguin = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby penguin",
    imgPathNeutral: penguinBabyImgPathNeutral,
    imgPathSmiling: penguinBabyImgPathSmiling,
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen penguin",
    imgPathNeutral: penguinTeenImgPathNeutral,
    imgPathSmiling: penguinTeenImgPathSmiling,
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult penguin",
    imgPathNeutral: penguinAdultImgPathNeutral,
    imgPathSmiling: penguinAdultImgPathSmiling,
  },
};

const unicorn = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby unicorn",
    imgPathNeutral: unicornBabyImgPathNeutral,
    imgPathSmiling: unicornBabyImgPathSmiling,
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen unicorn",
    imgPathNeutral: unicornTeenImgPathNeutral,
    imgPathSmiling: unicornTeenImgPathSmiling,
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult unicorn",
    imgPathNeutral: unicornAdultImgPathNeutral,
    imgPathSmiling: unicornAdultImgPathSmiling,
  },
};

const petData = { dragon, penguin, unicorn };

export default petData;
