import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import "./ExperienceBar.scss";
const BASE_EXPERIENCE_POINTS = 100;

const ExperienceBar = () => {
  const [experience, setExperience] = useState(0);
  const [level, setLevel] = useState(0);

  const pet = useSelector((state) => state?.session?.pet);

  function getLevel(experiencePoints) {
    let level = 0;
    let totalExperience = 0;

    while (totalExperience <= experiencePoints) {
      level++;
      totalExperience += level * 100;
    }

    return level;
  }

  function totalExperienceNeededForNextLevel(experience) {
    const currentLevel = getLevel(experience);
    let totalPointsNeededForNextLevel = 0;

    for (let count = 1; count <= currentLevel; count++) {
      totalPointsNeededForNextLevel += count * BASE_EXPERIENCE_POINTS;
    }

    return totalPointsNeededForNextLevel;
  }

  useEffect(() => {
    const exp = pet?.experience || 0;
    setExperience((exp / totalExperienceNeededForNextLevel(exp)) * 100);
    setLevel(Math.floor(getLevel(exp)));
  }, [pet]);

  return (
    <div className="experience-container">
      <div className="experience-bar">
        <div
          className="experience-bar-inner"
          style={{ width: `${experience}%` }}
        ></div>
        <span className="level-indicator"></span>
        <p className="level-text">
          <b
            style={{
              fontFamily: "Open Sans",
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
