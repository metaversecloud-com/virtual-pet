import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import backArrow from "../../assets/backArrow.svg";
import { tradePet, updatePet } from "../../redux/actions/session";
import { getLevel, getS3URL } from "../utils.js";
import "./EditPetScreen.scss";

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

const petNames = ["Max", "Luna", "Charlie", "Bella", "Cooper", "Daisy", "Milo", "Lucy", "Buddy", "Lily"];

const EditPetScreen = ({ setShowEditPetScreen, petAge }) => {
  const dispatch = useDispatch();
  const [selectedPet, setSelectedPet] = useState(petColors[0]);
  const [selectedName, setSelectedName] = useState(petNames[0]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const keyAssetId = useSelector((state) => state?.session?.keyAssetId);
  const pet = useSelector((state) => state?.session?.pet);
  const currentPetExperience = 1000; //pet?.experience || 0;

  const { currentLevel } = getLevel(currentPetExperience);

  useEffect(() => {
    if (pet?.name) {
      setSelectedName(pet.name);
    }

    if (pet?.color !== undefined) {
      const foundPet = petColors.find((m) => m.color === pet.color);
      if (foundPet) setSelectedPet(foundPet);
    }
  }, [pet]);

  const selectPet = (pet) => {
    if (!pet.minLevelToUnlock || pet.minLevelToUnlock <= currentLevel) {
      setSelectedPet(pet);
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
      await dispatch(updatePet(selectedName, petColor, keyAssetId, pet));
    } catch (error) {
      console.error("Error updating pet:", error);
    } finally {
      setIsSaving(false);
      setShowEditPetScreen(false);
    }
  };

  function getBackArrow() {
    return (
      <div className="icon-with-rounded-border" onClick={() => setShowEditPetScreen(false)}>
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
        <div className="modal-container visible" style={{ display: "block", visibility: "visible" }}>
          <div className="modal">
            <h4>Trade your pet?</h4>
            <p className="p">
              You'll get to choose a new pet but lose access to your current pet. Your new pet will start at Level 1.
            </p>
            <div className="actions">
              <button className="btn-outline my-btn" onClick={handleCloseModal} disabled={isSaving}>
                Cancel
              </button>
              <button className="btn-danger my-btn" onClick={handleTradePet} disabled={isSaving}>
                Trade Pet
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        className="pet-selector-wrapper"
        style={{
          alignItems: "baseline",
          paddingLeft: "16px",
          paddingRight: "16px",
          overflowY: "auto",
          maxHeight: "calc(100% - 150px)",
          overflowY: "visible",
        }}
      >
        <div>
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
              className="pet-title"
              style={{
                flex: "1 0 auto",
                textAlign: "center",
                marginBottom: "0px",
                marginTop: "5px",
              }}
            >
              <h1>Edit Your Virtual Pet</h1>
            </div>
            <div style={{ flex: "0 1 auto", opacity: 0 }}> {getBackArrow()}</div>
          </div>

          <div className="pet-name-selection">
            <span>Name:</span>
            <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
              {petNames.map((name, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: "0px", marginTop: "24px" }}>
            <span className="label-text">Select Color:</span>
          </div>
          <div className="pet-grid">
            {petColors.map((petElement) => (
              <div key={petElement.id} className="pet-item">
                <div
                  className={`pet-container ${selectedPet.id === petElement.id ? "selected-container" : ""}`}
                  onClick={() => selectPet(petElement)}
                  style={{ padding: "0px" }}
                >
                  <div
                    className={`pet-square ${selectedPet.id === petElement.id ? "selected-square" : ""} ${
                      petElement.minLevelToUnlock && petElement.minLevelToUnlock > currentLevel ? "pet-disabled" : ""
                    }`}
                    style={{
                      backgroundImage: `url(${getS3URL()}/assets/${pet?.petType}/normal/${petAge}-color-${
                        petElement.id
                      }.png)`,
                      position: "relative",
                    }}
                  >
                    {petElement.minLevelToUnlock && petElement.minLevelToUnlock > currentLevel ? (
                      <>
                        <div className="overlay-style"></div>
                        <LockIcon />
                        <div className="tooltip">Level up to unlock new colors</div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="fixed-bottom" style={{ background: "white" }}>
            <div style={{ marginBottom: "6px" }}>
              <button className="btn-danger-outline" onClick={handleOpenModal} disabled={isSaving}>
                Trade Pet
              </button>
            </div>
            <button
              className="topia-default-button"
              onClick={() => handleUpdatePet(selectedPet.color)}
              style={{ width: "100%" }}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditPetScreen;
