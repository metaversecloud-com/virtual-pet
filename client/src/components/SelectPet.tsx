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
  const { pets, visitorInventory, badges } = useContext(GlobalStateContext);

  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [showCreatePet, setShowCreatePet] = useState(false);
  const [activeTab, setActiveTab] = useState("myPets");

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

  const getMyPets = () => {
    return (
      <>
        {pets &&
          Object.keys(pets).map((key) => {
            const pet = pets[key];
            const { petType, petAge, color, name } = pet;
            return (
              <div
                key={key}
                onClick={() => selectPet(key)}
                className={`card ${selectedPetId === key ? "success" : ""}`}
              >
                <div className="card-image" style={{ height: "auto" }}>
                  <img src={`${getS3URL()}/assets/${petType}/normal/${petAge}-color-${color}.png`} alt={name} />
                </div>
                <div className="card-details text-center">
                  <h4 className="card-title">{name}</h4>
                  <p className="card-description p2" style={{ height: "auto" }}>
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
              Adopt a New Pet
            </button>
          )}
        </PageFooter>
      </>
    );
  };

  const getBadges = () => {
    return (
      <div className="grid grid-cols-3 gap-6 pt-4">
        {badges &&
          Object.values(badges).map((badge) => {
            const hasBadge = visitorInventory?.badges && Object.keys(visitorInventory.badges).includes(badge.name);
            const style = { width: "90px", filter: "none" };
            if (!hasBadge) style.filter = "grayscale(1)";
            return (
              <div className="tooltip" key={badge.id}>
                <span className="tooltip-content">{badge.name}</span>
                <img src={badge.icon} alt={badge.name} style={style} />
              </div>
            );
          })}
      </div>
    );
  };

  return (
    <>
      {showCreatePet ? (
        <CreatePet setShowCreatePet={pets && Object.keys(pets).length > 0 ? setShowCreatePet : undefined} />
      ) : (
        <div className="grid gap-4">
          <div className="tab-container">
            <button className={activeTab === "myPets" ? "btn" : "btn btn-text"} onClick={() => setActiveTab("myPets")}>
              My Pets
            </button>
            <button className={activeTab === "badges" ? "btn" : "btn btn-text"} onClick={() => setActiveTab("badges")}>
              Badges
            </button>
          </div>

          {activeTab === "myPets" ? <div className="grid grid-cols-2 gap-2">{getMyPets()}</div> : getBadges()}
        </div>
      )}
    </>
  );
};

export default SelectPet;
