import { useContext, useState } from "react";

// components
import { ConfirmationModal, PageFooter } from "@/components";

// constants
import { petColors, petNames } from "@/constants";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";

// utils
import { backendAPI, getS3URL, setErrorMessage, setGameState } from "@/utils";

export const EditPet = ({ setShowEditPetScreen }: { setShowEditPetScreen: () => void }) => {
  const dispatch = useContext(GlobalDispatchContext);
  const { keyAssetId, petStatus } = useContext(GlobalStateContext);
  const { color, name, petType, currentLevel, petAge } = petStatus || { currentLevel: 0 };

  const [selectedColor, setSelectedColor] = useState(color ? petColors[color] : petColors[0]);
  const [selectedName, setSelectedName] = useState(name || petNames[0]);

  const [isSaving, setIsSaving] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const selectPetColor = (pet: { id: number; minLevelToUnlock?: number }) => {
    if (!pet.minLevelToUnlock || pet.minLevelToUnlock <= currentLevel) {
      setSelectedColor(petColors[pet.id]);
    }
  };

  const handleToggleShowConfirmationModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const handleTradePet = () => {
    setIsSaving(true);
    backendAPI
      .post("/trade-pet", { keyAssetId })
      .then((response) => {
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => setIsSaving(false));
  };

  const handleUpdatePet = () => {
    setIsSaving(true);
    backendAPI
      .post("/update-pet", { keyAssetId, selectedName, selectedColor: selectedColor.id })
      .then((response) => {
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => {
        setIsSaving(false);
        setShowEditPetScreen();
      });
  };

  const getPetElement = (id: number) => {
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
            width: "120px",
            height: "120px",
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
  };

  return (
    <div className="grid gap-4">
      <button className="icon-with-rounded-border mb-4" onClick={setShowEditPetScreen}>
        <img src={`https://sdk-style.s3.amazonaws.com/icons/arrow.svg`} />
      </button>

      <label>Name:</label>
      <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
        {petNames.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>

      <label className="mt-6">Select Color:</label>
      <div className="grid grid-cols-2 gap-4">{petColors.map((petElement) => getPetElement(petElement.id))}</div>

      <PageFooter>
        <button className="btn mb-2" disabled={isSaving} onClick={handleUpdatePet}>
          Save Changes
        </button>
        <button className="btn btn-danger" disabled={isSaving} onClick={handleToggleShowConfirmationModal}>
          Trade Pet
        </button>
      </PageFooter>

      {showConfirmationModal && (
        <ConfirmationModal
          title="Trade your pet?"
          message="You'll get to choose a new pet but lose access to your current pet. Your new pet will start at Level 1."
          handleOnConfirm={handleTradePet}
          handleToggleShowConfirmationModal={handleToggleShowConfirmationModal}
        />
      )}
    </div>
  );
};

export default EditPet;
