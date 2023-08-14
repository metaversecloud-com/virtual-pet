import React from "react";
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

const ActionIcon = ({ id, iconClass, action, disabled, toggleTooltip }) => {
  const iconSrc = icons[id];

  if (!iconSrc) {
    return null;
  }

  return (
    <div
      className={`action-icon-wrapper ${disabled ? "disabled" : ""}`}
      onClick={disabled ? null : action}
      onMouseOver={() => toggleTooltip(id)}
      onMouseOut={() => toggleTooltip(null)}
    >
      <img id={id} src={iconSrc} alt={iconClass} className="action-icon" />
    </div>
  );
};

export default ActionIcon;
