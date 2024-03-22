import React from "react";
import ActionIcon from "./ActionIcon";
import "./ActionIcon.scss";

const ActionIconsContainer = ({ areAllButtonsDisabled, handlePetAction }) => {
  const FEED = "FEED";
  const SLEEP = "SLEEP";
  const PLAY = "PLAY";
  const TRAIN = "TRAIN";

  const actionIcons = [
    {
      id: FEED,
      iconClass: "fa-utensils",
      action: (onAnimationEnd) => handlePetAction(FEED, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
    {
      id: SLEEP,
      iconClass: "fa-bed",
      action: (onAnimationEnd) => handlePetAction(SLEEP, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
    {
      id: PLAY,
      iconClass: "fa-play",
      action: (onAnimationEnd) => handlePetAction(PLAY, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
    {
      id: TRAIN,
      iconClass: "fa-running",
      action: (onAnimationEnd) => handlePetAction(TRAIN, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
  ];

  return (
    <div>
      {actionIcons.map((icon) => (
        <ActionIcon key={icon.id} {...icon} pet onAnimationEnd={() => {}} />
      ))}
    </div>
  );
};

export default ActionIconsContainer;
