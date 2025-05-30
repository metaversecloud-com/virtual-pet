import { useState, useEffect } from "react";

export const ExperienceBar = ({
  experience,
  currentLevel,
  experienceNeededForNextLevel,
  experienceNeededForTheLevelYouCurrentlyAchieved,
  handleToggleShowLevelsModal,
}: {
  experience: number;
  currentLevel: number;
  experienceNeededForNextLevel: number;
  experienceNeededForTheLevelYouCurrentlyAchieved: number;
  handleToggleShowLevelsModal: () => void;
}) => {
  const [experiencePercentage, setExperiencePercentage] = useState(0);
  const [level, setLevel] = useState(0);

  useEffect(() => {
    const experiencePercentage =
      ((experience - experienceNeededForTheLevelYouCurrentlyAchieved) /
        (experienceNeededForNextLevel - experienceNeededForTheLevelYouCurrentlyAchieved)) *
      100;

    setExperiencePercentage(experiencePercentage);
    setLevel(currentLevel);
  }, [currentLevel, experience, experienceNeededForNextLevel, experienceNeededForTheLevelYouCurrentlyAchieved]);

  return (
    <div className="card">
      <p>Level</p>
      <button
        className="btn btn-icon mb-4"
        onClick={() => handleToggleShowLevelsModal()}
        style={{ position: "absolute", right: "26px" }}
      >
        <img src={`https://sdk-style.s3.amazonaws.com/icons/chevronRight.svg`} />
      </button>
      <h3>{`${level}`}</h3>
      <div className="tooltip">
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div className="h-3 rounded-full bg-gray-800" style={{ width: `${experiencePercentage}%` }} />
        </div>
        <span className="tooltip-content">{experiencePercentage}%</span>
      </div>
    </div>
  );
};

export default ExperienceBar;
