import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { getLevel } from "../../pages/utils.js";

import "./ExperienceBar.scss";

const ExperienceBar = () => {
  const [experiencePercentage, setExperiencePercentage] = useState(0);
  const [level, setLevel] = useState(0);

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

  return (
    <div className="experience-container">
      <div className="experience-bar">
        <div
          className="experience-bar-inner"
          style={{ width: `${experiencePercentage}%` }}
        ></div>
        <span className="level-indicator"></span>
        <p className="level-text">
          <b
            style={{
              fontFamily: "'Open Sans'",
              color: "#00875A",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >{`Level ${level}`}</b>
        </p>
      </div>
    </div>
  );
};

export default ExperienceBar;
