import { useCallback, useContext, useEffect, useState } from "react";

// components
import {
  ActionIconsContainer,
  ConfirmationModal,
  ExperienceBar,
  LevelsModal,
  PageFooter,
  PetColors,
} from "@/components";

// constants
import { petColors, petNames } from "@/constants";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { SET_SELECTED_PET } from "@/context/types";

// utils
import { backendAPI, getPetData, getS3URL, setErrorMessage, setGameState } from "@/utils";
import { defaultPetStatus } from "@/constants";
import { DELAY, FEED, initialPetState, PLAY, SLEEP, TRAIN } from "@/context/constants";

export const VirtualPet = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { keyAssetId, petStatus, isPetOwner, selectedPetId } = useContext(GlobalStateContext);
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
    isPetInWorld,
  } = petStatus || defaultPetStatus;

  const [petState, setPetState] = useState(initialPetState);
  const { petDescription } = getPetData(
    petAge as "baby" | "teen" | "adult",
    petType as "dragon" | "penguin" | "unicorn",
  );

  const [actionStatus, setActionStatus] = useState("DEFAULT");
  const [actionImage, setActionImage] = useState(`${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`);

  const [selectedColor, setSelectedColor] = useState(color ? petColors[color] : petColors[0]);
  const [selectedName, setSelectedName] = useState(name || petNames[0]);

  const [isSpawnBtnDisabled, setIsSpawnBtnDisabled] = useState(false);
  const [isPickupBtnDisabled, setIsPickupBtnDisabled] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [showLevelsModal, setShowLevelsModal] = useState(false);
  const [showAdoptionModal, setShowAdoptionModal] = useState(false);

  const areAllButtonsDisabled =
    petState?.isSleeping ||
    petState?.isFeeding ||
    petState?.isTraining ||
    petState?.isPlaying ||
    petState?.isLoading ||
    !isPetInWorld ||
    isSaving;

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
      .post("/spawn-pet", { keyAssetId, selectedPetId })
      .then((response) => {
        dispatch!({
          type: SET_SELECTED_PET,
          payload: {
            isPetOwner: true,
            petStatus: response.data.petStatus,
            selectedPetId: response.data.selectedPetId,
          },
        });
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => {
        setIsSpawnBtnDisabled(false);
      });
  };

  const handlePickupPet = async () => {
    resetPetState();
    setIsSpawnBtnDisabled(true);
    setIsPickupBtnDisabled(true);
    updatePetState({ isLoading: true });

    backendAPI
      .post("/pickup-pet")
      .then(() => {
        dispatch!({
          type: SET_SELECTED_PET,
          payload: {
            petStatus: { ...petStatus!, isPetInWorld: false },
            selectedPetId,
          },
        });
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => {
        setIsSpawnBtnDisabled(false);
        setIsPickupBtnDisabled(false);
        updatePetState({ isLoading: false });
      });
  };

  const handleClearSelection = async () => {
    setIsSpawnBtnDisabled(true);
    updatePetState({ isLoading: true });

    dispatch!({
      type: SET_SELECTED_PET,
      payload: {
        petStatus: undefined,
        selectedPetId: undefined,
      },
    });
  };

  const handleTradePet = () => {
    setIsSaving(true);
    backendAPI
      .post("/trade-pet", { keyAssetId, selectedPetId })
      .then((response) => {
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => {
        setIsSaving(false);
        setShowAdoptionModal(false);
      });
  };

  const selectPetColor = (pet: { id: number; minLevelToUnlock?: number }) => {
    if (!pet.minLevelToUnlock || pet.minLevelToUnlock <= currentLevel) {
      setSelectedColor(petColors[pet.id]);
    }
  };

  const handleUpdatePet = () => {
    setIsSaving(true);
    backendAPI
      .post("/update-pet", { keyAssetId, selectedName, selectedColor: selectedColor.id, selectedPetId })
      .then((response) => {
        dispatch!({
          type: SET_SELECTED_PET,
          payload: {
            petStatus: response.data.petStatus,
            selectedPetId,
          },
        });
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => {
        setIsSaving(false);
      });
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
      actionType: typeof FEED | typeof SLEEP | typeof PLAY | typeof TRAIN;
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
      setIsSpawnBtnDisabled(true);
      setIsPickupBtnDisabled(true);

      backendAPI
        .post("/execute-action", { action, keyAssetId, selectedPetId })
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

          setIsNotReady(true);
          setTimeout(() => {
            setIsNotReady(false);
          }, DELAY);
        })
        .finally(() => {
          updatePetState({ isLoading: false });
          setIsSpawnBtnDisabled(false);
          setIsPickupBtnDisabled(false);
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

  return (
    <>
      <button className="icon-with-rounded-border mb-4" onClick={() => handleClearSelection()}>
        <img src="https://sdk-style.s3.amazonaws.com/icons/arrow.svg" />
      </button>

      <div className="grid gap-4">
        <div className="card">
          <img src={actionImage} alt="Pet" />
        </div>

        <div className="card text-center">
          {isPetOwner ? (
            <>
              <select value={selectedName} className="m-auto" onChange={(e) => setSelectedName(e.target.value)}>
                {petNames.map((name, index) => (
                  <option key={index} className="h4" value={name}>
                    {name}
                  </option>
                ))}
              </select>
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
          handleToggleShowLevelsModal={() => setShowLevelsModal(true)}
        />

        {isPetOwner && (
          <>
            <PetColors
              petType={petType!}
              petAge={petAge!}
              currentLevel={currentLevel!}
              selectedColor={selectedColor}
              selectPetColor={selectPetColor}
            />

            <PageFooter>
              {/* <button className="btn btn-outline mb-2" disabled={isSpawnBtnDisabled} onClick={handleClearSelection}>
              Select Another Pet
            </button> */}
              <div className="grid gap-2">
                {selectedColor.id !== color || selectedName !== name ? (
                  <button className="btn btn-outline" disabled={isSaving} onClick={handleUpdatePet}>
                    Save Changes
                  </button>
                ) : (
                  <button
                    className="btn btn-danger-outline"
                    disabled={isSaving}
                    onClick={() => setShowAdoptionModal(true)}
                  >
                    Put Up for Adoption
                  </button>
                )}

                {isPetInWorld ? (
                  <button
                    className="btn"
                    disabled={isPickupBtnDisabled || areAllButtonsDisabled}
                    onClick={handlePickupPet}
                  >
                    Pick up Pet
                  </button>
                ) : (
                  <button className="btn" disabled={isSpawnBtnDisabled} onClick={handleSpawnPet}>
                    Call Pet
                  </button>
                )}
              </div>
            </PageFooter>
          </>
        )}

        {showLevelsModal && <LevelsModal handleToggleShowLevelsModal={() => setShowLevelsModal(false)} />}

        {showAdoptionModal && (
          <ConfirmationModal
            title="Put Up for Adoption?"
            message="Your pet will be adopted by someone else. This can't be undone."
            handleOnConfirm={handleTradePet}
            handleToggleShowConfirmationModal={() => setShowAdoptionModal(false)}
          />
        )}
      </div>
    </>
  );
};

export default VirtualPet;
