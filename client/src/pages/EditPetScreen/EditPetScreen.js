import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import backArrow from "../../assets/backArrow.svg";

import { getPet } from "../../redux/actions/session";
import MobileMenu from "../../components/mobileMenu/MobileMenu";

import "./EditPetScreen.scss";

import dragonBabyColor0Neutral from "../../assets/dragon/normal/baby-color-0.png";
import dragonBabyColor1Neutral from "../../assets/dragon/normal/baby-color-1.png";
import dragonBabyColor2Neutral from "../../assets/dragon/normal/baby-color-2.png";

import penguinImg from "../../assets/penguin/normal/baby.png";
import unicornImg from "../../assets/unicorn/normal/baby.png";

import { getLevel } from "../utils.js";

import { updatePet } from "../../redux/actions/session";

const petColors = [
  {
    id: 0,
    name: "Dragon",
    petType: "dragon",
    description: "Flame Rift Dragon",
    image: dragonBabyColor0Neutral,
    color: 0,
  },
  {
    id: 1,
    name: "Dragon",
    petType: "dragon",
    description: "Sky Talon Dragon",
    image: dragonBabyColor1Neutral,
    color: 1,
  },
  {
    id: 2,
    name: "Dragon",
    petType: "dragon",
    description: "Frost Dragon",
    image: dragonBabyColor2Neutral,
    minLevelToUnlock: 3,
    color: 2,
  },
  {
    id: 3,
    name: "Dragon",
    petType: "dragon",
    description: "Flame Rift Dragon",
    image: dragonBabyColor0Neutral,
    minLevelToUnlock: 3,
    color: 3,
  },
  {
    id: 4,
    name: "Dragon",
    petType: "dragon",
    description: "Sky Talon Dragon",
    image: dragonBabyColor1Neutral,
    minLevelToUnlock: 4,
    color: 4,
  },
  {
    id: 5,
    name: "Dragon",
    petType: "dragon",
    description: "Frost Dragon",
    image: dragonBabyColor2Neutral,
    minLevelToUnlock: 4,
    color: 5,
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

const EditPetScreen = ({ setShowEditPetScreen }) => {
  const dispatch = useDispatch();
  const [selectedMascot, setSelectedMascot] = useState(petColors[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(petNames[0]);
  const [isSaving, setIsSaving] = useState(false);

  const pet = useSelector((state) => state?.session?.pet);
  const visitor = useSelector((state) => state?.session?.visitor);

  console.log("pet", pet);

  const currentPetExperience = pet?.experience || 0;

  const { currentLevel } = getLevel(currentPetExperience);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getPet());
    };

    fetchData();
  }, [dispatch]);

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

  const handleUpdatePet = async (petColor) => {
    try {
      setIsSaving(true);
      await dispatch(updatePet(selectedName, petColor));
    } catch (error) {
      console.error("Erro ao atualizar o pet:", error);
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
        <img src={backArrow} />
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
      {/* {visitor?.isAdmin && <MobileMenu />} */}
      <div
        className="mascot-selector-wrapper"
        style={{ alignItems: "baseline" }}
      >
        <Container>
          <div
            className="title-container"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
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
              <DropdownToggle caret>{selectedName}</DropdownToggle>
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
          <div style={{ marginBottom: "8px" }}>
            <span className="label-text">Select Color:</span>
          </div>
          <Row
            className="justify-content-center"
            style={{ padding: "0px 30px" }}
          >
            {petColors.map((mascot) => (
              <Col
                key={mascot.id}
                xs={6}
                className="mb-4 d-flex justify-content-center"
              >
                <div
                  className={`mascot-container ${
                    selectedMascot.id === mascot.id ? "selected-container" : ""
                  }`}
                  onClick={() => selectMascot(mascot)}
                >
                  <div
                    className={`mascot-square ${
                      selectedMascot.id === mascot.id ? "selected-square" : ""
                    }`}
                    style={{
                      backgroundImage: `url(${mascot.image})`,
                      position: "relative",
                    }}
                  >
                    {mascot.minLevelToUnlock &&
                    mascot.minLevelToUnlock > currentLevel ? (
                      <>
                        <div className="overlay-style"></div>
                        <LockIcon />
                      </>
                    ) : null}
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="fixed-bottom" style={{ background: "white" }}>
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
