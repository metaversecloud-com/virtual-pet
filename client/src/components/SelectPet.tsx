import { useContext, useState } from "react";

// components
import { PageFooter } from "./PageFooter";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";

// utils
import { getS3URL } from "@/utils";
import { SET_SELECTED_PET } from "@/context/types";
import CreatePet from "./CreatePet";

export const SelectPet = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { pets } = useContext(GlobalStateContext);

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [showCreatePet, setShowCreatePet] = useState(false);

  const selectPet = (petId: string) => {
    if (petId === selectedPetId) setSelectedPetId(null);
    setSelectedPetId(petId);
  };

  const handleConfirmSelection = () => {
    if (!pets || !selectedPetId) return;

    dispatch!({
      type: SET_SELECTED_PET,
      payload: {
        selectedPetId,
        petStatus: pets[selectedPetId],
      },
    });
  };

  return (
    <div className="grid gap-4">
      {showCreatePet ? (
        <CreatePet />
      ) : (
        <>
          <h3>Your Virtual Pets</h3>

          {pets &&
            Object.keys(pets).map((key) => {
              const pet = pets[key];
              const { petType, petAge, color, name } = pet;
              return (
                <div
                  key={key}
                  onClick={() => selectPet(key)}
                  className={`card small ${selectedPetId === key ? "success" : ""}`}
                >
                  <div className="card-image">
                    {" "}
                    <img
                      src={`${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`}
                      alt={name}
                      className="pet-image"
                    />
                  </div>
                  <div className="card-details">
                    <h4 className="card-title">{name}</h4>
                    <p className="card-description p2">
                      {petAge && petAge.charAt(0).toUpperCase() + petAge.slice(1)}{" "}
                      {petType && petType.charAt(0).toUpperCase() + petType.slice(1)}
                    </p>
                  </div>
                </div>
              );
            })}

          <PageFooter>
            {pets && selectedPetId ? (
              <button className="btn" onClick={handleConfirmSelection}>
                Choose {pets[selectedPetId].name}
              </button>
            ) : (
              <button className="btn" onClick={() => setShowCreatePet(true)}>
                Create a New Pet
              </button>
            )}
          </PageFooter>
        </>
      )}
    </div>
  );
};

export default SelectPet;
