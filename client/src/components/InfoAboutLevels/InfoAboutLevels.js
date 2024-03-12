import React from "react";
import { useSelector } from "react-redux";
import { Card, CardImg } from "reactstrap";
import backArrowIconSvg from "../../assets/backArrowIcon.svg";
import "./InfoAboutLevels.scss";

const InfoAboutLevels = ({ toggleShowInfoAboutLevels }) => {
  const BASE_URL = window.location.origin;
  const visitor = useSelector((state) => state?.session?.visitor);
  const pet = useSelector((state) => state?.session?.pet);
  const petType = pet?.petType;
  const petColor = pet?.color || "0";

  function backArrowIcon() {
    return (
      <div
        className="icon-circle-container"
        style={{ position: "absolute", left: "16px", zIndex: "50" }}
        onClick={() => {
          toggleShowInfoAboutLevels();
        }}
      >
        <div className="icon-circle-text">
          <img src={backArrowIconSvg} alt="back arrow" />
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
              src={`${BASE_URL}/assets/${pet?.petType}/normal/baby-color-${petColor}.png`}
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
              src={`${BASE_URL}/assets/${pet?.petType}/normal/teen-color-${petColor}.png`}
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
              src={`${BASE_URL}/assets/${pet?.petType}/normal/adult-color-${petColor}.png`}
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
