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
import { ReactComponent as PencilIcon } from "../../assets/pen-to-square-regular.svg";
import { getS3URL } from "../../utils/utils";

const DELAY_LONG = 6000;
const DELAY_MEDIUM = 3500;
const FEED = "FEED";
const SLEEP = "SLEEP";
const PLAY = "PLAY";
const TRAIN = "TRAIN";

const Pet = ({ petAge, setShowEditPetScreen }) => {
  const dispatch = useDispatch();

  const { isSpawnedDroppedAsset } = useParams();

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

  const pet = useSelector((state) => state?.session?.pet);
  const isPetAssetOwner = useSelector(
    (state) => state?.session?.isPetAssetOwner
  );
  const petColor = pet?.color || "0";
  const petType = pet?.petType;

  const [petSelected, setPetSelected] = useState({});
  const [actionStatus, setActionStatus] = useState("DEFAULT");

  const foodTimestamp = pet?.food?.foodTimestamp;
  const sleepTimestamp = pet?.sleep?.sleepTimestamp;
  const playTimestamp = pet?.sleep?.playTimestamp;
  const trainTimestamp = pet?.sleep?.trainTimestamp;

  const areAllButtonsDisabled =
    petState?.isSleeping ||
    petState?.isFeeding ||
    petState?.isTraining ||
    petState?.isPlaying ||
    petState?.isLoading ||
    !pet?.isPetInWorld;

  useEffect(() => {
    const petAgeMap = {
      baby: petData?.[petType]?.baby,
      teen: petData?.[petType]?.teen,
      adult: petData?.[petType]?.adult,
    };

    setPetSelected(petAgeMap[petAge]);
  }, [petAge, pet, petType]);

  useEffect(() => {
    if (actionStatus === "SPAWNING") {
      const timer = setTimeout(() => {
        setActionStatus("DEFAULT");
      }, DELAY_MEDIUM);

      return () => clearTimeout(timer);
    }
  }, [actionStatus]);

  const getActionImage = () => {
    if (petState?.isFeeding) {
      return `${getS3URL()}/assets/${petType}/normal/doing-action/${petAge}-color-${petColor}-feed.png`;
    } else if (petState?.isSleeping) {
      return `${getS3URL()}/assets/${petType}/normal/doing-action/${petAge}-color-${petColor}-sleep.png`;
    } else if (petState?.isTraining) {
      return `${getS3URL()}/assets/${petType}/normal/doing-action/${petAge}-color-${petColor}-train.png`;
    } else if (petState?.isPlaying) {
      return `${getS3URL()}/assets/${petType}/normal/doing-action/${petAge}-color-${petColor}-play.png`;
    }

    return `${getS3URL()}/assets/${petType}/normal/${petAge}-color-${petColor}.png`;
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
        }, DELAY_LONG);
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

  function getEditButton() {
    return (
      <div
        style={{
          position: "absolute",
          left: "32px",
          top: "92px",
          background: "#0A2540",
        }}
        className="icon-with-rounded-border"
        onClick={() => {
          setShowEditPetScreen(true);
        }}
      >
        <PencilIcon />
      </div>
    );
  }

  if (showInfoAboutLevels) {
    return (
      <InfoAboutLevels
        toggleShowInfoAboutLevels={toggleShowInfoAboutLevels}
        petAge={petAge}
      />
    );
  }

  const actionImage = getActionImage();

  const notPetAssetOwnerView = () => (
    <Card className="virtual-friend white-overlay">
      <div className="card-img-container" style={{ marginBottom: "6px" }}>
        <CardImg top width="100%" src={actionImage} alt="Pet" />
      </div>
      <CardBody style={{ paddingTop: "0px" }}>
        <div className="general-card-container">
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
        <ExperienceBar
          isFeeding={petState?.isFeeding}
          toggleShowInfoAboutLevels={toggleShowInfoAboutLevels}
        />
      </CardBody>
    </Card>
  );

  return isPetAssetOwner ? (
    <>
      <div className="virtual-friend white-overlay">
        <div className="card-img-container">
          {getEditButton()}
          <CardImg top width="100%" src={actionImage} alt="Pet" />
        </div>

        <CardBody>
          <div className="action-icon-container">
            <CardTitle tag="h5">
              <p style={{ marginBottom: "7px" }}>
                <b style={{ color: "#0A2540" }}>{pet?.name}</b>
              </p>
              <p>
                <b style={{ color: "#0A2540" }}>
                  {petSelected?.petDescription}
                </b>
              </p>
            </CardTitle>{" "}
            <ActionIconsContainer
              isSleeping={petState.isSleeping}
              isLoading={petState.isLoading}
              areAllButtonsDisabled={areAllButtonsDisabled}
              pet={pet}
              handlePetAction={handlePetAction}
            />
          </div>
          <ExperienceBar
            isFeeding={petState.isFeeding}
            toggleShowInfoAboutLevels={toggleShowInfoAboutLevels}
          />
        </CardBody>

        <CardFooter style={{ padding: 0, border: "none" }}>
          {!pet?.isPetInWorld ? (
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
      </div>
    </>
  ) : (
    notPetAssetOwnerView()
  );
};

export default Pet;
