import React from "react";
import { useSelector } from "react-redux";
import Bed from "../../assets/actionIcons/bed.svg";
import PersonRunning from "../../assets/actionIcons/person-running.svg";
import Play from "../../assets/actionIcons/play.svg";
import Utensils from "../../assets/actionIcons/utensils.svg";

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

  if (!iconSrc) {
    return null;
  }

  return (
    <div
      className={`action-icon-wrapper ${disabled ? "disabled" : ""}`}
      onClick={disabled ? null : action}
    >
      <img id={id} src={iconSrc} alt={iconClass} className="action-icon" />
      <span className="tooltip-text">
        {pet?.isPetInWorld ? capitalize(id) : "Call pet to take any action."}
      </span>
    </div>
  );
};

export default ActionIcon;
