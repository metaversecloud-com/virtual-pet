import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
} from "reactstrap";
import { spawnPet, executeAction } from "../../redux/actions/session";
import ExperienceBar from "../experienceBar/ExperienceBar";
import petData from "./petData";
import ActionIconsContainer from "./ActionIconsContainer";

const DELAY_LONG = 5000;
const DELAY_MEDIUM = 3500;
const FEED = "FEED";
const SLEEP = "SLEEP";
const PLAY = "PLAY";
const TRAIN = "TRAIN";

const Pet = ({ petAge }) => {
  const dispatch = useDispatch();

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
  };

  const [petState, setPetState] = useState(initialPetState);

  const resetPetState = () => {
    setPetState(initialPetState);
  };

  const updatePetState = (updates) => {
    setPetState((prevState) => ({ ...prevState, ...updates }));
  };

  // Using useSelector to get values from redux store
  const pet = useSelector((state) => state?.session?.pet);
  const isPetAssetOwner = useSelector(
    (state) => state?.session?.isPetAssetOwner
  );
  const petType = pet?.petType;

  const [petSelected, setPetSelected] = useState({});
  const [actionStatus, setActionStatus] = useState("DEFAULT");

  const foodTimestamp = pet?.food?.foodTimestamp;
  const sleepTimestamp = pet?.sleep?.sleepTimestamp;
  const playTimestamp = pet?.sleep?.playTimestamp;
  const trainTimestamp = pet?.sleep?.trainTimestamp;

  // Set pet data based on pet age
  useEffect(() => {
    const petAgeMap = {
      baby: petData?.[petType]?.baby,
      teen: petData?.[petType]?.teen,
      adult: petData?.[petType]?.adult,
    };

    setPetSelected(petAgeMap[petAge]);
  }, [petAge, pet, petType]);

  // Effect to handle action status
  useEffect(() => {
    if (actionStatus === "SPAWNING") {
      const timer = setTimeout(() => {
        setActionStatus("DEFAULT");
      }, DELAY_MEDIUM);

      return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  // Gets the message that is displayed in the UI, according to the pet status
  const getMessage = () => {
    if (petState.isFeeding) {
      return petSelected?.beingFedMessage;
    } else if (petState.isSleeping) {
      return "Zzz...";
    } else if (petState.isTraining) {
      return "Training!";
    } else if (petState.isPlaying) {
      return "I love to play!";
    } else if (petState.isNotHungry) {
      return petSelected?.notHungryMessage;
    } else if (petState.isNotSleepy) {
      return "I'm not sleepy";
    } else if (petState.dontWantToPlay) {
      return "I don't want to play right now.";
    } else if (petState.dontWantToTrain) {
      return "I don't want to train right now.";
    } else {
      return "Ready for some action!";
    }
  };

  // Add the pet to the world
  const handleSpawnPet = async () => {
    resetPetState();
    updatePetState({ spawnPetButtonIsDisabled: true });
    await dispatch(spawnPet());
    const timer = setTimeout(() => {
      updatePetState({ spawnPetButtonIsDisabled: false });
    }, 3500);
    return () => clearTimeout(timer);
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
      timestamp: foodTimestamp,
      setActionState: (val) => updatePetState({ isFeeding: val }),
      setIsNotReady: (val) => updatePetState({ isNotHungry: val }),
      action: FEED,
    },
    [SLEEP]: {
      timestamp: sleepTimestamp,
      setActionState: (val) => updatePetState({ isSleeping: val }),
      setIsNotReady: (val) => updatePetState({ isNotSleepy: val }),
      action: SLEEP,
    },
    [PLAY]: {
      timestamp: playTimestamp,
      setActionState: (val) => updatePetState({ isPlaying: val }),
      setIsNotReady: (val) => updatePetState({ dontWantToPlay: val }),
      action: PLAY,
    },
    [TRAIN]: {
      timestamp: trainTimestamp,
      setActionState: (val) => updatePetState({ isTraining: val }),
      setIsNotReady: (val) => updatePetState({ dontWantToTrain: val }),
      action: TRAIN,
    },
  };

  const handlePetAction = useCallback(
    async (actionType) => {
      resetErrors();
      const { timestamp, setActionState, setIsNotReady, action } =
        actionConfig[actionType];

      const currentTime = Date.now();
      const timeSinceLastAction = currentTime - timestamp;
      const actionInterval = DELAY_LONG;

      if (timeSinceLastAction < actionInterval) {
        setIsNotReady(true);
        return;
      }

      updatePetState({ isLoading: true });
      const success = await dispatch(executeAction(action));
      updatePetState({ isLoading: false });

      if (success) {
        setIsNotReady(false);
        setActionState(true);
        setTimeout(() => {
          setActionState(false);
        }, DELAY_MEDIUM);
      } else {
        setIsNotReady(true);
      }
    },
    [
      foodTimestamp,
      sleepTimestamp,
      playTimestamp,
      trainTimestamp,
      dispatch,
      actionConfig,
    ]
  );

  const resetErrors = () => {
    updatePetState({
      dontWantToTrain: false,
      dontWantToPlay: false,
      isNotSleepy: false,
      isNotHungry: false,
    });
  };

  const notPetAssetOwnerView = () => (
    <Card className="virtual-friend white-overlay">
      <CardImg
        top
        width="100%"
        src={petSelected?.imgPathNeutral}
        alt="Pet"
        className={petState.isSleeping ? "sleeping" : ""}
      />
      <ExperienceBar isFeeding={petState.isFeeding} />
      <CardBody>
        <CardTitle tag="h5">
          {petSelected?.petDescription} - {pet?.name}
        </CardTitle>
        <CardSubtitle
          tag="h6"
          className="mb-2 text-muted"
          style={{
            color: "#3B5166",
            paddingBottom: "0px",
            fontFamily: "Open Sans",
          }}
        >
          Owner: {pet?.username}
        </CardSubtitle>
      </CardBody>
    </Card>
  );

  return isPetAssetOwner ? (
    <Card className="virtual-friend white-overlay">
      <CardImg
        top
        width="100%"
        src={
          petState.isFeeding
            ? petSelected?.imgPathSmiling
            : petSelected?.imgPathNeutral
        }
        alt="Pet"
        className={`img-border ${petState.isSleeping ? "sleeping" : ""}`}
      />

      <CardBody>
        <CardTitle tag="h5">
          {petSelected?.petDescription} - {pet?.name}
        </CardTitle>{" "}
        <CardSubtitle
          tag="h6"
          className="mb-2 text-muted"
          style={{
            color: "#3B5166",
            paddingBottom: "0px",
            fontFamily: "Open Sans",
          }}
        >
          {getMessage()}
        </CardSubtitle>
        <ExperienceBar isFeeding={petState.isFeeding} />
        <ActionIconsContainer
          isSleeping={petState.isSleeping}
          isLoading={petState.isLoading}
          pet={pet}
          handlePetAction={handlePetAction}
        />
      </CardBody>

      <CardFooter style={{ padding: 0, border: "none" }}>
        <button
          className={`spawn-button ${
            petState.spawnPetButtonIsDisabled ||
            petState.isSleeping ||
            petState.isLoading
              ? "disabled"
              : ""
          }`}
          onClick={!petState.spawnPetButtonIsDisabled ? handleSpawnPet : null}
        >
          Spawn Pet
        </button>
      </CardFooter>
    </Card>
  ) : (
    notPetAssetOwnerView()
  );
};

export default Pet;
