import dragonBabyImgPathNeutral from "../../assets/dragon/normal/baby.png";
import dragonTeenImgPathNeutral from "../../assets/dragon/normal/teen.png";
import dragonAdultImgPathNeutral from "../../assets/dragon/normal/adult.png";

import dragonBabyColor0Neutral from "../../assets/dragon/normal/baby-color-0.png";
import dragonBabyColor1Neutral from "../../assets/dragon/normal/baby-color-1.png";
import dragonBabyColor2Neutral from "../../assets/dragon/normal/baby-color-2.png";

import dragonTeenColor0Neutral from "../../assets/dragon/normal/teen-color-0.png";
import dragonTeenColor1Neutral from "../../assets/dragon/normal/teen-color-1.png";
import dragonTeenColor2Neutral from "../../assets/dragon/normal/teen-color-2.png";

import dragonAdultColor0Neutral from "../../assets/dragon/normal/adult-color-0.png";
import dragonAdultColor1Neutral from "../../assets/dragon/normal/adult-color-1.png";
import dragonAdultColor2Neutral from "../../assets/dragon/normal/adult-color-2.png";

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
    imgPathNeutral: [
      dragonBabyColor0Neutral,
      dragonBabyColor1Neutral,
      dragonBabyColor2Neutral,
    ],
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
    petDescription: "Baby Penguin",
    imgPathNeutral: penguinBabyImgPathNeutral,
    imgPathSmiling: penguinBabyImgPathSmiling,
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen Penguin",
    imgPathNeutral: penguinTeenImgPathNeutral,
    imgPathSmiling: penguinTeenImgPathSmiling,
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult Penguin",
    imgPathNeutral: penguinAdultImgPathNeutral,
    imgPathSmiling: penguinAdultImgPathSmiling,
  },
};

const unicorn = {
  baby: {
    beingFedMessage: "So Yummy!!",
    notHungryMessage: "I'm not hungry.",
    petDescription: "Baby Unicorn",
    imgPathNeutral: unicornBabyImgPathNeutral,
    imgPathSmiling: unicornBabyImgPathSmiling,
  },

  teen: {
    beingFedMessage: "Yum! Thanks for feeding me!!",
    notHungryMessage: "I don't want to eat right now.",
    petDescription: "Teen Unicorn",
    imgPathNeutral: unicornTeenImgPathNeutral,
    imgPathSmiling: unicornTeenImgPathSmiling,
  },
  adult: {
    beingFedMessage: "So great! Thanks!",
    notHungryMessage: "I'm not hungry right now.",
    petDescription: "Adult Unicorn",
    imgPathNeutral: unicornAdultImgPathNeutral,
    imgPathSmiling: unicornAdultImgPathSmiling,
  },
};

const petData = { dragon, penguin, unicorn };

export default petData;
