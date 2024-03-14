import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Row,
  Col,
  Container,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { getPet } from "../../redux/actions/session";
import MobileMenu from "../../components/mobileMenu/MobileMenu";

import "./PetFirstTimeCreation.scss";

import dragonImg from "../../assets/dragon/normal/baby.png";
import penguinImg from "../../assets/penguin/normal/baby.png";
import unicornImg from "../../assets/unicorn/normal/baby.png";

import { createPet } from "../../redux/actions/session";

const pets = [
  {
    id: 0,
    name: "Dragon",
    petType: "dragon",
    description:
      "A mystical, fire-breathing creature that soars through the skies.",
    image: dragonImg,
  },
  {
    id: 1,
    name: "Penguin",
    petType: "penguin",
    description:
      "A playful bird with striking patterns that swims but does not fly!",
    image: penguinImg,
  },
  {
    id: 2,
    name: "Unicorn",
    petType: "unicorn",
    description: "A magical and majestic creature that is difficult to catch.",
    image: unicornImg,
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

const PetFirstTimeCreation = () => {
  const dispatch = useDispatch();
  const [selectedPet, setSelectedPet] = useState(pets[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(petNames[0]);

  const visitor = useSelector((state) => state?.session?.visitor);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getPet());
    };

    fetchData();
  }, [dispatch]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const selectPet = (pet) => {
    setSelectedPet(pet);
  };

  const handleSelection = () => {
    dispatch(createPet(selectedPet?.petType, selectedName));
  };

  return (
    <>
      {visitor?.isAdmin && <MobileMenu />}
      <div
        className="pet-selector-wrapper"
        style={{ paddingTop: visitor?.isAdmin ? "126px" : undefined }}
      >
        <Container>
          <div className="pet-title">
            <h1>Choose Your Virtual Pet</h1>
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
          <Row className="justify-content-center">
            {pets.map((pet) => (
              <Col key={pet.id} xs={12} sm={6} md={4} className="mb-4">
                <Card
                  onClick={() => selectPet(pet)}
                  className={`pet-card ${
                    selectedPet.id === pet.id ? "selected" : ""
                  }`}
                >
                  <Row className="no-gutters">
                    <Col xs={4} className="pet-image-container">
                      <CardImg
                        src={pet.image}
                        alt={pet.name}
                        className="pet-image"
                      />
                    </Col>
                    <Col xs={7}>
                      <CardBody>
                        <CardTitle tag="h5">{pet.name}</CardTitle>
                        <CardText>{pet.description}</CardText>
                      </CardBody>
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="fixed-bottom" style={{ background: "white" }}>
            <button className="topia-default-button" onClick={handleSelection}>
              Choose {selectedPet.name}
            </button>
          </div>
        </Container>
      </div>
    </>
  );
};

export default PetFirstTimeCreation;
