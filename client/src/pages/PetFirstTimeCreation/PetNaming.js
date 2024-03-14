import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
  Container,
} from "reactstrap";
import "./PetNaming.scss";

import { namePet } from "../../redux/actions/session";

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

const PetNaming = () => {
  const dispatch = useDispatch();
  const [selectedName, setSelectedName] = useState(petNames[0]);

  const selectName = (name) => {
    setSelectedName(name);
  };

  const handleSelection = (name) => {
    dispatch(namePet(name));
  };

  return (
    <div className="pet-naming-wrapper">
      <Container>
        <div className="pet-naming-title">
          <h1>Name Your Virtual Pet</h1>
        </div>
        <Row className="justify-content-center">
          {petNames.map((name, index) => (
            <Col key={index} xs={12} sm={6} md={4} className="mb-4">
              <Card
                onClick={() => selectName(name)}
                className={`pet-name-card ${
                  selectedName === name ? "selected" : ""
                }`}
              >
                <CardBody>
                  <CardTitle tag="h5" className="text-center">
                    {name}
                  </CardTitle>
                  <Button
                    className={`name-selection-button ${
                      selectedName === name ? "visible" : ""
                    }`}
                    onClick={() => handleSelection(name)}
                  >
                    Choose Name
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default PetNaming;
