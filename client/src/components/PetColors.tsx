// constants
import { petColors } from "@/constants";

// utils
import { getS3URL } from "@/utils";

type PetColorType = {
  id: number;
  color: number;
  minLevelToUnlock?: number;
};

export const PetColors = ({
  petType,
  petAge,
  currentLevel,
  selectedColor,
  selectPetColor,
}: {
  petType: string;
  petAge: string;
  currentLevel: number;
  selectedColor: PetColorType;
  selectPetColor: (color: PetColorType) => void;
}) => {
  return (
    <div className="card">
      <div className="grid grid-cols-4 gap-2">
        {petColors.map((petColor) => {
          const { id } = petColor;
          const petElement = petColors.find((petElement) => petElement.id === id) || petColors[0];
          const isDisabled = petElement.minLevelToUnlock && petElement.minLevelToUnlock > currentLevel;
          return (
            <div key={petElement.id} className="tooltip">
              <div
                className={`card ${selectedColor.id === petElement.id ? "success" : ""}`}
                onClick={() => selectPetColor(petElement)}
                style={{
                  backgroundSize: "cover",
                  backgroundImage: `url(${getS3URL()}/assets/${petType}/normal/${petAge}-color-${petElement.id}.png)`,
                  backgroundColor: `rgba(255, 255, 255, 0.6)`,
                  backgroundBlendMode: `${isDisabled ? "lighten" : "normal"}`,
                  width: "60px",
                  height: "60px",
                }}
              >
                {isDisabled && (
                  <span className="tooltip-content" style={{ width: "150px", top: "30px", left: "40%" }}>
                    Level up to unlock new colors
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PetColors;
