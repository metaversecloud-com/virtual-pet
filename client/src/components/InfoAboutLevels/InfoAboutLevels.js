import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import backArrowIconSvg from "../../assets/backArrowIcon.svg";
import petData from "../pets/petData.js";
import "./InfoAboutLevels.scss";

const InfoAboutLevels = ({ toggleShowInfoAboutLevels }) => {
  const visitor = useSelector((state) => state?.session?.visitor);
  const pet = useSelector((state) => state?.session?.pet);
  const petType = pet?.petType;

  function backArrowIcon() {
    return (
      <div
        className="icon-circle-container"
        style={{ position: "absolute", left: "16px" }}
        onClick={() => {
          toggleShowInfoAboutLevels();
        }}
      >
        <div className="icon-circle-text">
          <img src={backArrowIconSvg} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`info-about-levels-wrapper ${
        visitor?.isAdmin ? "admin-margin" : ""
      }`}
    >
      {backArrowIcon()}
      <Card className="virtual-friend white-overlay">
        <div className="pet-info">
          <div
            className="pet-info-img-container"
            style={{ width: "80px", height: "80px" }}
          >
            <CardImg
              top
              src={petData?.[petType]?.baby?.imgPathNeutral}
              alt="Pet"
              style={{
                width: "50px",
              }}
            />
          </div>
          <h5>Level 1 - 5</h5>
          <p>Baby</p>
        </div>

        <div className="pet-info">
          <div
            className="pet-info-img-container"
            style={{ width: "130px", height: "130px" }}
          >
            <CardImg
              top
              width="100px"
              src={petData?.[petType]?.teen?.imgPathNeutral}
              alt="Pet"
              style={{
                width: "100px",
              }}
            />
          </div>

          <h5>Level 5 - 10</h5>
          <p>Teen</p>
        </div>
        <div className="pet-info">
          <div
            className="pet-info-img-container"
            style={{ width: "180px", height: "180px" }}
          >
            <CardImg
              top
              width="150px"
              src={petData?.[petType]?.adult?.imgPathNeutral}
              alt="Pet"
              style={{
                width: "140px",
              }}
            />
          </div>
          <h5>Level 10+</h5>
          <p>Adult</p>
        </div>
      </Card>
    </div>
  );
};

export default InfoAboutLevels;
