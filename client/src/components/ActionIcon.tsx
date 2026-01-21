import { useContext, useState } from "react";

import Bed from "../assets/actionIcons/bed.svg";
import PersonRunning from "../assets/actionIcons/person-running.svg";
import Play from "../assets/actionIcons/play.svg";
import Utensils from "../assets/actionIcons/utensils.svg";

// context
import { GlobalStateContext } from "@/context/GlobalContext";
import { defaultPetStatus } from "@/constants";

const queryParameters = new URLSearchParams(window.location.search);
const isCheatCodeOn = queryParameters.get("isCheatCodeOn");

const ACTION_COOLDOWNS = {
  FEED: isCheatCodeOn ? 500 : 1000 * 60 * 60 * 1,
  SLEEP: 1000 * 60 * 45,
  PLAY: 1000 * 60 * 15,
  TRAIN: 1000 * 60 * 30,
};

const icons = {
  SLEEP: Bed,
  TRAIN: PersonRunning,
  PLAY: Play,
  FEED: Utensils,
};

const capitalize = (str: string) => {
  if (!str || typeof str !== "string") return "";
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)?.toLowerCase();
};

export const ActionIcon = ({
  actionType,
  iconClass,
  action,
  disabled,
  onAnimationEnd,
}: {
  actionType: "SLEEP" | "TRAIN" | "PLAY" | "FEED";
  iconClass: string;
  action: () => Promise<void>;
  disabled: boolean;
  onAnimationEnd: () => void;
}) => {
  const { petStatus } = useContext(GlobalStateContext);

  const key = actionType.toLowerCase() as keyof typeof defaultPetStatus;
  const actionStatus = petStatus ? petStatus[key] : defaultPetStatus[key];
  const lastActionTime = typeof actionStatus === "object" && actionStatus?.timestamp ? actionStatus.timestamp : null;

  const iconSrc = icons[actionType];
  const [showTooltipText, setShowTooltipText] = useState(true);

  const isCooldownActive = () => {
    if (!petStatus) return true; // Handle undefined petStatus
    if (!lastActionTime) return false; // No last action time means no cooldown
    const currentTime = Date.now();
    const cooldownTime = ACTION_COOLDOWNS[actionType];
    return currentTime - lastActionTime < cooldownTime;
  };

  const getTooltipText = () => {
    if (!petStatus?.isPetInWorld) {
      return "Call pet to take action.";
    }
    if (isCooldownActive()) {
      switch (actionType) {
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
    return capitalize(actionType);
  };

  const handleAction = async () => {
    if (disabled || isCooldownActive()) return;
    setShowTooltipText(false);
    await action();
    setShowTooltipText(true);
    onAnimationEnd();
  };

  if (!iconSrc) return null;

  return (
    <button className="btn btn-icon" disabled={disabled || isCooldownActive()} onClick={handleAction}>
      <div className="tooltip">
        <img id={actionType} src={iconSrc} alt={iconClass} />
        {showTooltipText && (
          <span className="tooltip-content" style={{ width: "100px" }}>
            {getTooltipText()}
          </span>
        )}
      </div>
    </button>
  );
};

export default ActionIcon;
