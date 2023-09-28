import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getLevel } from "../../pages/utils.js";
import infoImg from "../../assets/rightArrow.svg";

import "./ExperienceBar.scss";

const ExperienceBar = ({ toggleShowInfoAboutLevels }) => {
  const [experiencePercentage, setExperiencePercentage] = useState(0);
  const [level, setLevel] = useState(0);
  console.log("toggleShowInfoAboutLevels", toggleShowInfoAboutLevels);
  const pet = useSelector((state) => state?.session?.pet);

  useEffect(() => {
    const currentPetExperience = pet?.experience || 0;

    const {
      currentLevel,
      experienceNeededForNextLevel,
      experienceNeededForTheLevelYouCurrentlyAchieved,
    } = getLevel(currentPetExperience);

    let experiencePorcentage =
      ((currentPetExperience -
        experienceNeededForTheLevelYouCurrentlyAchieved) /
        (experienceNeededForNextLevel -
          experienceNeededForTheLevelYouCurrentlyAchieved)) *
      100;

    setExperiencePercentage(experiencePorcentage);
    setLevel(currentLevel);
  }, [pet]);

  function infoIcon() {
    return (
      <div
        className="icon-circle-container"
        onClick={() => {
          toggleShowInfoAboutLevels();
        }}
        style={{ position: "absolute", right: "16px" }}
      >
        <div className="icon-circle-text">
          <img src={infoImg} />
        </div>
      </div>
    );
  }

  return (
    <div className="experience-container">
      {infoIcon()}
      <p className="level-text" style={{ textAlign: "left" }}>
        <b
          style={{
            fontFamily: "'Open Sans'",
            color: "#00875A",
            marginBottom: "20px",
            fontSize: "14px",
          }}
        >
          Level
        </b>
      </p>
      <p className="level-number">{`${level}`}</p>
      <div className="experience-bar">
        <div
          className="experience-bar-inner"
          style={{ width: `${experiencePercentage}%` }}
        ></div>
        <span className="level-indicator"></span>
      </div>
    </div>
  );
};

export default ExperienceBar;
