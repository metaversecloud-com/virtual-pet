import React from "react";
import ActionIcon from "./ActionIcon";
import "./ActionIcon.scss";

const ActionIconsContainer = ({
  isSleeping,
  isLoading,
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
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
    {
      id: SLEEP,
      iconClass: "fa-bed",
      action: () => handlePetAction(SLEEP),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
    {
      id: PLAY,
      iconClass: "fa-play",
      action: () => handlePetAction(PLAY),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
    {
      id: TRAIN,
      iconClass: "fa-running",
      action: () => handlePetAction(TRAIN),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
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
