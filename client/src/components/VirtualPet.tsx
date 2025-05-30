import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// components
import { ActionIconsContainer, EditPet, ExperienceBar, LevelsModal, PageFooter } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { SET_PET_IN_WORLD } from "@/context/types";

// utils
import { backendAPI, getPetData, getS3URL, setErrorMessage, setGameState } from "@/utils";
import { defaultPetStatus } from "@/constants";

const initialPetState = {
  isFeeding: false,
  isSleeping: false,
  isTraining: false,
  isPlaying: false,
  isNotHungry: false,
  isNotSleepy: false,
  dontWantToTrain: false,
  dontWantToPlay: false,
  isLoading: false,
  spawnPetButtonIsDisabled: false,
  pickupPetButtonIsDisabled: false,
};

const FEED = "FEED";
const SLEEP = "SLEEP";
const PLAY = "PLAY";
const TRAIN = "TRAIN";

const DELAY = 6000;

export const VirtualPet = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { keyAssetId, petStatus, isPetInWorld, isPetAssetOwner } = useContext(GlobalStateContext);
  const {
    color,
    experience,
    name,
    petType,
    feed,
    sleep,
    play,
    train,
    currentLevel,
    experienceNeededForNextLevel,
    experienceNeededForTheLevelYouCurrentlyAchieved,
    petAge,
    username,
  } = petStatus || defaultPetStatus;

  const [showEditPetScreen, setShowEditPetScreen] = useState(false);
  const [showLevelsModal, setShowLevelsModal] = useState(false);

  const [petState, setPetState] = useState(initialPetState);
  const { petDescription } = getPetData(
    petAge as "baby" | "teen" | "adult",
    petType as "dragon" | "penguin" | "unicorn",
  );

  const [actionStatus, setActionStatus] = useState("DEFAULT");
  const [actionImage, setActionImage] = useState(`${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`);

  const [isSpawnBtnDisabled, setIsSpawnBtnDisabled] = useState(false);
  const [isPickupBtnDisabled, setIsPickupBtnDisabled] = useState(false);

  const areAllButtonsDisabled =
    petState?.isSleeping ||
    petState?.isFeeding ||
    petState?.isTraining ||
    petState?.isPlaying ||
    petState?.isLoading ||
    !isPetInWorld;

  const resetPetState = () => {
    setPetState(initialPetState);
  };

  const updatePetState = (updates: {
    isFeeding?: boolean;
    isNotHungry?: boolean;
    isSleeping?: boolean;
    isNotSleepy?: boolean;
    isPlaying?: boolean;
    dontWantToPlay?: boolean;
    isTraining?: boolean;
    dontWantToTrain?: boolean;
    isLoading?: boolean;
    spawnPetButtonIsDisabled?: boolean;
    pickupPetButtonIsDisabled?: boolean;
  }) => {
    setPetState((prevState) => ({ ...prevState, ...updates }));
  };

  useEffect(() => {
    if (actionStatus === "SPAWNING") {
      const timer = setTimeout(() => {
        setActionStatus("DEFAULT");
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  useEffect(() => {
    setActionImage(`${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`);
  }, [petAge, color, petType]);

  const handleSpawnPet = async () => {
    resetPetState();
    setIsSpawnBtnDisabled(true);
    backendAPI
      .post("/spawn-pet", { keyAssetId })
      .then(() => {
        dispatch!({
          type: SET_PET_IN_WORLD,
          payload: {
            isPetInWorld: true,
            isPetAssetOwner: true,
            petStatus,
          },
        });
      })
      .catch((error) => setErrorMessage(dispatch, error));
    setIsSpawnBtnDisabled(false);
  };

  const handlePickupPet = async () => {
    resetPetState();
    setIsSpawnBtnDisabled(true);
    setIsPickupBtnDisabled(true);
    backendAPI
      .post("/pickup-pet", { keyAssetId })
      .then(() => {
        dispatch!({
          type: SET_PET_IN_WORLD,
          payload: {
            isPetInWorld: false,
            isPetAssetOwner: true,
            petStatus,
          },
        });
      })
      .catch((error) => setErrorMessage(dispatch, error));
    setIsSpawnBtnDisabled(false);
    setIsPickupBtnDisabled(false);
  };

  /*
   * Configuration object for different pet actions. Each action has:
   * a timestamp representing when the action last happened
   * a setActionState function that updates the corresponding action state of the pet
   * a setIsNotReady function that updates the state when the pet is not ready for the action
   * an action property that is the type of the action (FEED, SLEEP, PLAY, TRAIN)
   */
  const actionConfig = {
    [FEED]: {
      timestamp: feed?.timestamp,
      setActionState: (val: boolean) => updatePetState({ isFeeding: val }),
      setIsNotReady: (val: boolean) => updatePetState({ isNotHungry: val }),
      action: FEED,
    },
    [SLEEP]: {
      timestamp: sleep?.timestamp,
      setActionState: (val: boolean) => updatePetState({ isSleeping: val }),
      setIsNotReady: (val: boolean) => updatePetState({ isNotSleepy: val }),
      action: SLEEP,
    },
    [PLAY]: {
      timestamp: play?.timestamp,
      setActionState: (val: boolean) => updatePetState({ isPlaying: val }),
      setIsNotReady: (val: boolean) => updatePetState({ dontWantToPlay: val }),
      action: PLAY,
    },
    [TRAIN]: {
      timestamp: train?.timestamp,
      setActionState: (val: boolean) => updatePetState({ isTraining: val }),
      setIsNotReady: (val: boolean) => updatePetState({ dontWantToTrain: val }),
      action: TRAIN,
    },
  };

  const handlePetAction = useCallback(
    async ({
      actionType,
      onAnimationEnd,
    }: {
      actionType: "FEED" | "SLEEP" | "PLAY" | "TRAIN";
      onAnimationEnd: () => void;
    }) => {
      resetErrors();
      const { timestamp: rawTimestamp, setActionState, setIsNotReady, action } = actionConfig[actionType];
      const timestamp = rawTimestamp ? Number(rawTimestamp) : 0;

      const currentTime = Date.now();
      const timeSinceLastAction = currentTime - timestamp;
      const actionInterval = DELAY;

      if (timeSinceLastAction < actionInterval) {
        setIsNotReady(true);
        setTimeout(() => {
          setIsNotReady(false);
        }, actionInterval - timeSinceLastAction);
        return;
      }

      updatePetState({ isLoading: true });

      backendAPI
        .post("/execute-action", { action, keyAssetId })
        .then((response) => {
          setGameState(dispatch, response.data);
          setActionState(true);
          setActionImage(
            `${getS3URL()}/assets/${petType}/normal/doing-action/${petAge}-color-${color}-${actionType.toLowerCase()}.png`,
          );

          setTimeout(() => {
            setActionState(false);
            setActionImage(`${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`);
            updatePetState({ isLoading: false });
            onAnimationEnd();
          }, DELAY);
        })
        .catch((error) => {
          setErrorMessage(dispatch, error);

          updatePetState({ isLoading: false });
          setIsNotReady(true);
          setTimeout(() => {
            setIsNotReady(false);
          }, DELAY);
        });
    },
    [dispatch, actionConfig, petAge, color, petType],
  );

  const resetErrors = () => {
    updatePetState({
      dontWantToTrain: false,
      dontWantToPlay: false,
      isNotSleepy: false,
      isNotHungry: false,
    });
  };

  const handleToggleShowShowEditPetScreen = () => {
    setShowEditPetScreen(!showEditPetScreen);
  };

  const handleToggleShowLevelsModal = () => {
    setShowLevelsModal(!showLevelsModal);
  };

  if (showEditPetScreen) return <EditPet setShowEditPetScreen={handleToggleShowShowEditPetScreen} />;

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="card-image">
          {keyAssetId && isPetAssetOwner && (
            <button
              className="btn btn-icon"
              style={{
                position: "relative",
                left: "18px",
                top: "14px",
              }}
              onClick={handleToggleShowShowEditPetScreen}
            >
              <img src="https://sdk-style.s3.amazonaws.com/icons/edit.svg" />
            </button>
          )}
          <img src={actionImage} alt="Pet" />
        </div>
      </div>

      <div className="card text-center">
        {isPetAssetOwner ? (
          <>
            <h4 className="card-title">{name}</h4>
            <p className="p2">{petDescription}</p>
            <ActionIconsContainer
              areAllButtonsDisabled={areAllButtonsDisabled}
              handlePetAction={(actionType, onAnimationEnd) => handlePetAction({ actionType, onAnimationEnd })}
            />
          </>
        ) : (
          <>
            <h4 className="card-title">{name}</h4>
            <h6>My owner is {username}</h6>
            <h6>I'm a {petDescription}</h6>
          </>
        )}
      </div>

      <ExperienceBar
        experience={experience}
        currentLevel={currentLevel}
        experienceNeededForNextLevel={experienceNeededForNextLevel}
        experienceNeededForTheLevelYouCurrentlyAchieved={experienceNeededForTheLevelYouCurrentlyAchieved}
        handleToggleShowLevelsModal={handleToggleShowLevelsModal}
      />

      {isPetAssetOwner && (
        <PageFooter>
          {keyAssetId && !isPetInWorld ? (
            <button className="btn" disabled={isSpawnBtnDisabled} onClick={handleSpawnPet}>
              Call Pet
            </button>
          ) : (
            isPetInWorld && (
              <button className="btn" disabled={isPickupBtnDisabled} onClick={handlePickupPet}>
                Pick up Pet
              </button>
            )
          )}
        </PageFooter>
      )}

      {showLevelsModal && <LevelsModal handleToggleShowLevelsModal={handleToggleShowLevelsModal} />}
    </div>
  );
};

export default VirtualPet;
