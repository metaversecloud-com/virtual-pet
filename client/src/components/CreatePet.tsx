import { useContext, useState } from "react";

// components
import { PageFooter } from "./PageFooter";

// constants
import { petNames, pets } from "@/constants";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

export const CreatePet = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { keyAssetId } = useContext(GlobalStateContext);

  const [selectedPet, setSelectedPet] = useState(pets[0]);
  const [selectedName, setSelectedName] = useState(petNames[0]);

  interface Pet {
    id: number;
    name: string;
    petType: string;
    image: string;
    description: string;
  }

  const selectPet = (pet: Pet) => {
    setSelectedPet(pet);
  };

  const handleSelection = () => {
    backendAPI
      .post("/create-pet", { petType: selectedPet.petType, name: selectedName, keyAssetId })
      .then((response) => {
        setGameState(dispatch, response.data);
      })
      .catch((error) => setErrorMessage(dispatch, error));
  };

  return (
    <div className="grid gap-4">
      <h3>Choose Your Virtual Pet</h3>

      <label>Name:</label>
      <select className="input" value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
        {petNames.map((name, index) => (
          <option key={index} value={name}>
            {name}
          </option>
        ))}
      </select>

      {pets.map((pet) => (
        <div
          key={pet.id}
          onClick={() => selectPet(pet)}
          className={`card small ${selectedPet.id === pet.id ? "success" : ""}`}
        >
          <div className="card-image">
            {" "}
            <img src={pet.image} alt={pet.name} className="pet-image" />
          </div>
          <div className="card-details">
            <h4 className="card-title">{pet.name}</h4>
            <p className="card-description p2">{pet.description}</p>
          </div>
        </div>
      ))}

      <PageFooter>
        <button className="btn" onClick={handleSelection}>
          Choose {selectedPet.name}
        </button>
      </PageFooter>
    </div>
  );
};

export default CreatePet;
