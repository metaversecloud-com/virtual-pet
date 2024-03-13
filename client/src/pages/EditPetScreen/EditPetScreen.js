import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";

import {
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import backArrow from "../../assets/backArrow.svg";

import { tradePet } from "../../redux/actions/session";

import "./EditPetScreen.scss";

import { getLevel } from "../utils.js";

import { updatePet } from "../../redux/actions/session";

const petColors = [
  {
    id: 0,
    color: 0,
  },
  {
    id: 1,
    minLevelToUnlock: 2,
    color: 1,
  },
  {
    id: 2,
    minLevelToUnlock: 3,
    color: 2,
  },
  {
    id: 3,
    minLevelToUnlock: 4,
    color: 3,
  },
];

const petNames = [
  "Max",
  "Luna",
  "Charlie",
  "Bella",
  "Cooper",
  "Daisy",
  "Milo",
  "Lucy",
  "Buddy",
  "Lily",
];

const EditPetScreen = ({ setShowEditPetScreen, petAge }) => {
  const dispatch = useDispatch();
  const [selectedMascot, setSelectedMascot] = useState(petColors[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(petNames[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const pet = useSelector((state) => state?.session?.pet);

  const currentPetExperience = pet?.experience || 0;

  const { currentLevel } = getLevel(currentPetExperience);

  useEffect(() => {
    if (pet?.name) {
      setSelectedName(pet.name);
    }

    if (pet?.color !== undefined) {
      const foundMascot = petColors.find((m) => m.color === pet.color);
      if (foundMascot) setSelectedMascot(foundMascot);
    }
  }, [pet]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const selectMascot = (mascot) => {
    if (!mascot.minLevelToUnlock || mascot.minLevelToUnlock <= currentLevel) {
      setSelectedMascot(mascot);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleTradePet = async () => {
    try {
      setIsSaving(true);
      await dispatch(tradePet());
    } catch (error) {
      console.error("Error trading:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePet = async (petColor) => {
    try {
      setIsSaving(true);
      await dispatch(updatePet(selectedName, petColor));
    } catch (error) {
      console.error("Error updating pet:", error);
    } finally {
      setIsSaving(false);
    }
  };

  function getBackArrow() {
    return (
      <div
        className="icon-with-rounded-border"
        onClick={() => setShowEditPetScreen(false)}
      >
        <img src={backArrow} alt="pet" />
      </div>
    );
  }

  const LockIcon = () => (
    <FontAwesomeIcon
      icon={faLock}
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1,
        color: "black",
        pointerEvents: "none",
      }}
    />
  );

  return (
    <>
      {isModalVisible && (
        <div className="my-modal-container">
          <div className="my-modal">
            <h4>Trade your pet?</h4>
            <p className="my-p">
              You'll get to choose a new pet but lose access to your current
              pet. Your new pet will start at Level 1.
            </p>
            <div className="actions">
              <button
                className="btn-outline my-btn"
                onClick={handleCloseModal}
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                className="btn-danger my-btn"
                onClick={handleTradePet}
                disabled={isSaving}
              >
                Trade Pet
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="mascot-selector-wrapper"
        style={{
          alignItems: "baseline",
          paddingLeft: "16px",
          paddingRight: "16px",
          overflowY: "auto",
          maxHeight: "calc(100% - 150px)",
          overflowY: "visible",
        }}
      >
        <Container>
          <div
            className="title-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              marginBottom: "50px",
            }}
          >
            <div style={{ flex: "0 1 auto" }}>{getBackArrow()}</div>
            <div
              className="mascot-title"
              style={{
                flex: "1 0 auto",
                textAlign: "center",
                marginBottom: "0px",
                marginTop: "5px",
              }}
            >
              <h1>Edit Your Virtual Pet</h1>
            </div>
            <div style={{ flex: "0 1 auto", opacity: 0 }}>
              {" "}
              {getBackArrow()}
            </div>
          </div>

          <div className="pet-name-selection">
            <span>Name:</span>
            <Dropdown isOpen={dropdownOpen} toggle={toggle}>
              <DropdownToggle caret style={{ marginBottom: "0px" }}>
                {selectedName}
              </DropdownToggle>
              <DropdownMenu>
                {petNames.map((name, index) => (
                  <DropdownItem
                    key={index}
                    onClick={() => setSelectedName(name)}
                  >
                    {name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
          <div style={{ marginBottom: "0px", marginTop: "24px" }}>
            <span className="label-text">Select Color:</span>
          </div>
          <div className="pet-grid">
            {petColors.map((mascot) => (
              <div key={mascot.id} className="pet-item">
                <div
                  className={`mascot-container ${
                    selectedMascot.id === mascot.id ? "selected-container" : ""
                  }`}
                  onClick={() => selectMascot(mascot)}
                  style={{ padding: "0px" }}
                >
                  <div
                    className={`mascot-square ${
                      selectedMascot.id === mascot.id ? "selected-square" : ""
                    } ${
                      mascot.minLevelToUnlock &&
                      mascot.minLevelToUnlock > currentLevel
                        ? "mascot-disabled"
                        : ""
                    }`}
                    style={{
                      backgroundImage: `url(${getS3URL()}/assets/${
                        pet?.petType
                      }/normal/${petAge}-color-${mascot.id}.png)`,
                      position: "relative",
                    }}
                  >
                    {mascot.minLevelToUnlock &&
                    mascot.minLevelToUnlock > currentLevel ? (
                      <>
                        <div className="overlay-style"></div>
                        <LockIcon />
                        <div className="tooltip">
                          Level up to unlock new colors
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed-bottom" style={{ background: "white" }}>
            <p
              style={{ color: "red", cursor: "pointer" }}
              onClick={handleOpenModal}
            >
              Trade Pet
            </p>
            <button
              className="topia-default-button"
              onClick={() => handleUpdatePet(selectedMascot.color)}
              style={{ width: "100%" }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default EditPetScreen;
