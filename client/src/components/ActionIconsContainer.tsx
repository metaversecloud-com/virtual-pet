import { ActionTypeEnum } from "@/types";
import { ActionIcon } from "@/components";

export const ActionIconsContainer = ({
  areAllButtonsDisabled,
  handlePetAction,
}: {
  areAllButtonsDisabled: boolean;
  handlePetAction: (actionType: ActionTypeEnum, onAnimationEnd: () => void) => void;
}) => {
  const actionIcons = [
    {
      actionType: ActionTypeEnum.FEED,
      iconClass: "fa-utensils",
      action: (onAnimationEnd: () => void) => handlePetAction(ActionTypeEnum.FEED, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
    {
      actionType: ActionTypeEnum.SLEEP,
      iconClass: "fa-bed",
      action: (onAnimationEnd: () => void) => handlePetAction(ActionTypeEnum.SLEEP, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
    {
      actionType: ActionTypeEnum.PLAY,
      iconClass: "fa-play",
      action: (onAnimationEnd: () => void) => handlePetAction(ActionTypeEnum.PLAY, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
    {
      actionType: ActionTypeEnum.TRAIN,
      iconClass: "fa-running",
      action: (onAnimationEnd: () => void) => handlePetAction(ActionTypeEnum.TRAIN, onAnimationEnd),
      disabled: areAllButtonsDisabled,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-8 align-items-center justify-items-center mt-3">
      {actionIcons.map((icon) => (
        <ActionIcon
          key={icon.actionType}
          action={() => Promise.resolve(icon.action(() => {}))}
          actionType={icon.actionType}
          iconClass={icon.iconClass}
          disabled={icon.disabled}
          onAnimationEnd={() => {}}
        />
      ))}
    </div>
  );
};

export default ActionIconsContainer;
