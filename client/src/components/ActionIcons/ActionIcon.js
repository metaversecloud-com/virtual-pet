// ActionIcon.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Bed from "../../assets/actionIcons/bed.svg";
import PersonRunning from "../../assets/actionIcons/person-running.svg";
import Play from "../../assets/actionIcons/play.svg";
import Utensils from "../../assets/actionIcons/utensils.svg";

const ACTION_COOLDOWNS = {
  PLAY: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 15,
  SLEEP: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 45,
  FEED: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 60 * 1,
  TRAIN: process.env.IS_LOCALHOST ? 500 : 1000 * 60 * 30,
};

const icons = {
  SLEEP: Bed,
  TRAIN: PersonRunning,
  PLAY: Play,
  FEED: Utensils,
};

function capitalize(str) {
  if (!str || typeof str !== "string") return "";
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
}

const ActionIcon = ({ id, iconClass, action, disabled }) => {
  const pet = useSelector((state) => state?.session?.pet);
  const iconSrc = icons[id];
  const [remainingTime, setRemainingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = Date.now();
      const lastActionTime = pet?.[id]?.timestamp;
      const cooldownTime = ACTION_COOLDOWNS[id];
      const elapsedTime = currentTime - lastActionTime;
      const remainingTimePercentage = Math.max(
        0,
        ((cooldownTime - elapsedTime) / cooldownTime) * 100
      );
      setRemainingTime(remainingTimePercentage);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [pet, id]);

  const isCooldownActive = () => {
    return remainingTime > 0;
  };

  const getTooltipText = () => {
    if (!pet?.isPetInWorld) {
      return "Call pet to take any action.";
    }

    if (isCooldownActive()) {
      switch (id) {
        case "FEED":
          return "I'm not hungry";
        case "SLEEP":
          return "I'm not tired right now";
        case "PLAY":
          return "Let's play later";
        case "TRAIN":
          return "I need a break from training.";
        default:
          return "";
      }
    }

    return capitalize(id);
  };

  if (!iconSrc) {
    return null;
  }

  return (
    <div
      className={`action-icon-wrapper ${
        disabled || isCooldownActive() ? "disabled" : ""
      }`}
      onClick={disabled || isCooldownActive() ? null : action}
    >
      <img id={id} src={iconSrc} alt={iconClass} className="action-icon" />
      <span className="tooltip-text">{getTooltipText()}</span>
      <div
        className="cooldown-progress"
        style={{
          background: `conic-gradient(#4CAF50 ${remainingTime}%, #DEE2E5 ${remainingTime}%)`,
        }}
      ></div>
    </div>
  );
};

export default ActionIcon;
