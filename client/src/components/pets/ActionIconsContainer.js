import React from "react";
import ActionIcon from "./ActionIcon";

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
      iconClass: "fa-utensils",
      action: () => handlePetAction(FEED),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
    {
      iconClass: "fa-bed",
      action: () => handlePetAction(SLEEP),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
    {
      iconClass: "fa-play",
      action: () => handlePetAction(PLAY),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
    {
      iconClass: "fa-running",
      action: () => handlePetAction(TRAIN),
      disabled: isSleeping || isLoading || !pet?.isPetInWorld,
    },
  ];

  return (
    <>
      {actionIcons.map((icon, index) => (
        <ActionIcon key={index} {...icon} />
      ))}
    </>
  );
};

export default ActionIconsContainer;
