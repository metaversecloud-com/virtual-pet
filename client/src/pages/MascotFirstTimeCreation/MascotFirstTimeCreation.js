import React, { useState } from "react";
import { useDispatch } from "react-redux";
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
import "./MascotFirstTimeCreation.scss";

import dragonImg from "../../assets/dragon/normal/baby.png";
import penguinImg from "../../assets/penguin/normal/baby.png";
import unicornImg from "../../assets/unicorn/normal/baby.png";

import { createPet } from "../../redux/actions/session";

const mascots = [
  {
    id: 0,
    name: "Dragon",
    petType: "dragon",
    description: "A mystical, fiery creature that soars through the skies.",
    image: dragonImg,
  },
  {
    id: 1,
    name: "Penguin",
    petType: "penguin",
    description: "An agile, fierce predator with striking patterns.",
    image: penguinImg,
  },
  {
    id: 2,
    name: "Unicorn",
    petType: "unicorn",
    description: "A strong, gentle giant of the forests.",
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

const MascotFirstTimeCreation = () => {
  const dispatch = useDispatch();
  const [selectedMascot, setSelectedMascot] = useState(mascots[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedName, setSelectedName] = useState(petNames[0]);

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const selectMascot = (mascot) => {
    setSelectedMascot(mascot);
  };

  const handleSelection = () => {
    dispatch(createPet(selectedMascot?.petType, selectedName));
  };

  return (
    <div className="mascot-selector-wrapper">
      <Container>
        <div className="mascot-title">
          <h1>Choose Your Virtual Mascot</h1>
        </div>
        <div className="pet-name-selection">
          <span>Pet's name:</span>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>{selectedName}</DropdownToggle>
            <DropdownMenu>
              {petNames.map((name, index) => (
                <DropdownItem key={index} onClick={() => setSelectedName(name)}>
                  {name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>
        <Row className="justify-content-center">
          {mascots.map((mascot) => (
            <Col key={mascot.id} xs={12} sm={6} md={4} className="mb-4">
              <Card
                onClick={() => selectMascot(mascot)}
                className={`mascot-card ${
                  selectedMascot.id === mascot.id ? "selected" : ""
                }`}
              >
                <div className="mascot-image-container">
                  <CardImg
                    top
                    src={mascot.image}
                    alt={mascot.name}
                    className="mascot-image"
                  />
                </div>
                <CardBody>
                  <CardTitle tag="h5">{mascot.name}</CardTitle>
                  <CardText>{mascot.description}</CardText>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="fixed-bottom p-3 d-flex justify-content-center">
          <Button className="choose-button" onClick={handleSelection}>
            Choose {selectedMascot.name}
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default MascotFirstTimeCreation;
