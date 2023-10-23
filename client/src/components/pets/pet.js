import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Card,
  CardImg,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
} from "reactstrap";
import {
  spawnPet,
  pickupPet,
  executeAction,
} from "../../redux/actions/session";
import ExperienceBar from "../experienceBar/ExperienceBar";
import petData from "./petData";
import ActionIconsContainer from "../ActionIcons/ActionIconsContainer";
import InfoAboutLevels from "../../components/InfoAboutLevels/InfoAboutLevels";

const DELAY_LONG = 5000;
const DELAY_MEDIUM = 3500;
const FEED = "FEED";
const SLEEP = "SLEEP";
const PLAY = "PLAY";
const TRAIN = "TRAIN";

const Pet = ({ petAge }) => {
  const dispatch = useDispatch();

  const { isSpawnedDroppedAsset } = useParams();
  console.log("isSpawnedDroppedAsset1", isSpawnedDroppedAsset);

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

  const [petState, setPetState] = useState(initialPetState);
  const [showInfoAboutLevels, setShowInfoAboutLevels] = useState(false);

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
      return "I need a break from playing.";
    } else if (petState.dontWantToTrain) {
      return "I don’t want to train anymore.";
    } else {
      return "";
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

  // Remove the pet to the world
  const handlePickupPet = async () => {
    resetPetState();
    updatePetState({
      spawnPetButtonIsDisabled: true,
      pickupPetButtonIsDisabled: true,
    });
    await dispatch(pickupPet(isSpawnedDroppedAsset));
    const timer = setTimeout(() => {
      updatePetState({
        spawnPetButtonIsDisabled: false,
        pickupPetButtonIsDisabled: false,
      });
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

  function toggleShowInfoAboutLevels() {
    setShowInfoAboutLevels(!showInfoAboutLevels);
  }

  if (showInfoAboutLevels) {
    return (
      <InfoAboutLevels toggleShowInfoAboutLevels={toggleShowInfoAboutLevels} />
    );
  }

  const notPetAssetOwnerView = () => (
    <Card className="virtual-friend white-overlay">
      <div className="card-img-container">
        <CardImg
          top
          width="100%"
          src={
            petState.isFeeding
              ? petSelected?.imgPathSmiling
              : petSelected?.imgPathNeutral
          }
          alt="Pet"
        />
      </div>
      <CardBody>
        <ExperienceBar
          isFeeding={petState.isFeeding}
          toggleShowInfoAboutLevels={toggleShowInfoAboutLevels}
        />
        <div className="general-card-container" style={{ marginTop: "16px" }}>
          <CardTitle tag="h5" style={{ marginTop: "16px" }}>
            {pet?.name}
          </CardTitle>
          <CardSubtitle
            tag="h6"
            className="mb-2 text-muted"
            style={{
              color: "#3B5166",
              paddingBottom: "0px",
              fontFamily: "'Open Sans'",
            }}
          >
            My owner is {pet?.username}
          </CardSubtitle>
          <CardSubtitle
            tag="h6"
            className="mb-2 text-muted"
            style={{
              color: "#3B5166",
              paddingBottom: "0px",
              fontFamily: "'Open Sans'",
            }}
          >
            I'm a {petSelected?.petDescription}
          </CardSubtitle>
        </div>
      </CardBody>
    </Card>
  );

  return isPetAssetOwner ? (
    <Card className="virtual-friend white-overlay">
      <div className="card-img-container">
        <CardImg
          top
          width="100%"
          src={
            petState.isFeeding
              ? petSelected?.imgPathSmiling
              : petSelected?.imgPathNeutral
          }
          alt="Pet"
        />
        <CardSubtitle
          tag="h6"
          className="mb-2 text-muted"
          style={{
            color: "#0A2540 !important",
            paddingBottom: "20px",
            fontFamily: "'Quicksand'",
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {getMessage() || <div style={{ minHeight: "20px" }}></div>}
        </CardSubtitle>
      </div>

      <CardBody>
        <ExperienceBar
          isFeeding={petState.isFeeding}
          toggleShowInfoAboutLevels={toggleShowInfoAboutLevels}
        />
        <div className="action-icon-container">
          <CardTitle tag="h5">
            <b style={{ color: "#0A2540" }}>
              {petSelected?.petDescription} - {pet?.name}
            </b>
          </CardTitle>{" "}
          <ActionIconsContainer
            isSleeping={petState.isSleeping}
            isLoading={petState.isLoading}
            pet={pet}
            handlePetAction={handlePetAction}
          />
        </div>
      </CardBody>

      <CardFooter style={{ padding: 0, border: "none" }}>
        {!pet.isPetInWorld ? (
          <div className="fixed-bottom">
            <button
              className={`topia-default-button ${
                petState.spawnPetButtonIsDisabled ||
                petState.isSleeping ||
                petState.isLoading
                  ? "disabled"
                  : ""
              }`}
              onClick={
                !petState.spawnPetButtonIsDisabled ? handleSpawnPet : null
              }
            >
              Call Pet
            </button>
          </div>
        ) : (
          <div className="fixed-bottom" style={{ background: "white" }}>
            <button
              className={`topia-default-button ${
                petState.spawnPetButtonIsDisabled ||
                petState.isSleeping ||
                petState.isLoading
                  ? "disabled"
                  : ""
              }`}
              onClick={
                !petState.spawnPetButtonIsDisabled ? handlePickupPet : null
              }
            >
              Pick up Pet
            </button>
          </div>
        )}
      </CardFooter>
    </Card>
  ) : (
    notPetAssetOwnerView()
  );
};

export default Pet;
