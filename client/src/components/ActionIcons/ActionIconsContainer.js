import React from "react";
import ActionIcon from "./ActionIcon";
import "./ActionIcon.scss";

const ActionIconsContainer = ({
  isSleeping,
  isLoading,
  areAllButtonsDisabled,
  pet,
  handlePetAction,
}) => {
  const FEED = "FEED";
  const SLEEP = "SLEEP";
  const PLAY = "PLAY";
  const TRAIN = "TRAIN";

  const actionIcons = [
    {
      id: FEED,
      iconClass: "fa-utensils",
      action: () => handlePetAction(FEED),
      disabled: areAllButtonsDisabled,
    },
    {
      id: SLEEP,
      iconClass: "fa-bed",
      action: () => handlePetAction(SLEEP),
      disabled: areAllButtonsDisabled,
    },
    {
      id: PLAY,
      iconClass: "fa-play",
      action: () => handlePetAction(PLAY),
      disabled: areAllButtonsDisabled,
    },
    {
      id: TRAIN,
      iconClass: "fa-running",
      action: () => handlePetAction(TRAIN),
      disabled: areAllButtonsDisabled,
    },
  ];

  return (
    <div>
      {actionIcons.map((icon) => (
        <ActionIcon key={icon.id} {...icon} pet />
      ))}
    </div>
  );
};

export default ActionIconsContainer;
