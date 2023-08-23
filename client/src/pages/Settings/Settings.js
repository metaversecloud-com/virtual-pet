import { Container, Row, Col, InputGroup, Button } from "reactstrap";

import "./Settings.scss";

import { deleteAll } from "../../redux/actions/session";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MobileMenu from "../../components/mobileMenu/MobileMenu";

const Settings = () => {
  const [isLoading] = useState(false);
  const [isSuccess] = useState(false);

  const error = useSelector((state) => state?.session?.error);
  const dispatch = useDispatch();

  const handleDeleteAllPets = () => {
    dispatch(deleteAll());
  };

  return (
    <div className="settings-wrapper">
      <Container>
        <Row className="justify-content-center align-items-center">
          <Col md="6" className="mx-auto">
            <h3 className="text-center">Settings</h3>
            <InputGroup>
              <button
                color="primary"
                onClick={handleDeleteAllPets}
                disabled={isLoading}
                style={{ margin: "0 auto" }}
                className="topia-default-button"
              >
                {isLoading ? "Loading..." : "Pick up all pets"}
              </button>
            </InputGroup>
            {isSuccess && !error && (
              <div className="mt-2 text-success">
                Pets deleted successfully!
              </div>
            )}
            {error && (
              <div className="mt-2 text-danger">
                There was an error deleting all pets
              </div>
            )}
          </Col>
        </Row>
      </Container>
      <MobileMenu />
    </div>
  );
};

export default Settings;
