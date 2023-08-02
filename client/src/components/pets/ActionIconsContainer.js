import React, { useState, useEffect } from "react";
import ActionIcon from "./ActionIcon";
import { Tooltip } from "reactstrap";

const ActionIconsContainer = ({
  isSleeping,
  isLoading,
  pet,
  handlePetAction,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(null);

  const toggle = (tooltipId) => {
    if (!pet?.isPetInWorld) {
      setTooltipOpen(tooltipOpen === tooltipId ? null : tooltipId);
    }
  };

  useEffect(() => {
    if (pet?.isPetInWorld && tooltipOpen !== null) {
      setTooltipOpen(null);
    }
  }, [pet?.isPetInWorld]);

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
    <>
      {actionIcons.map((icon) => (
        <ActionIcon key={icon.id} {...icon} toggleTooltip={toggle} />
      ))}
      {actionIcons.map((icon) => (
        <Tooltip
          key={icon.id}
          isOpen={tooltipOpen === icon.id}
          target={icon.id}
          toggle={() => toggle(icon.id)}
        >
          Add pet to the world before taking actions
        </Tooltip>
      ))}
    </>
  );
};

export default ActionIconsContainer;
