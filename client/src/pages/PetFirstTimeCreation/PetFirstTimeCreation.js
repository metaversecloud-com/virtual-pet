import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPet } from "../../redux/actions/session";
import MobileMenu from "../../components/mobileMenu/MobileMenu";
import dragonImg from "../../assets/dragon/normal/baby.png";
import penguinImg from "../../assets/penguin/normal/baby.png";
import unicornImg from "../../assets/unicorn/normal/baby.png";
import { createPet } from "../../redux/actions/session";
import "./PetFirstTimeCreation.scss";

const pets = [
  {
    id: 0,
    name: "Dragon",
    petType: "dragon",
    description: "A mystical, fire-breathing creature that soars through the skies.",
    image: dragonImg,
  },
  {
    id: 1,
    name: "Penguin",
    petType: "penguin",
    description: "A playful bird with striking patterns that swims but does not fly!",
    image: penguinImg,
  },
  {
    id: 2,
    name: "Unicorn",
    petType: "unicorn",
    description: "A magical and majestic creature that is difficult to catch.",
    image: unicornImg,
  },
];

const petNames = ["Max", "Luna", "Charlie", "Bella", "Cooper", "Daisy", "Milo", "Lucy", "Buddy", "Lily"];

const PetFirstTimeCreation = () => {
  const dispatch = useDispatch();
  const [selectedPet, setSelectedPet] = useState(pets[0]);
  const [selectedName, setSelectedName] = useState(petNames[0]);

  const visitor = useSelector((state) => state?.session?.visitor);
  const keyAssetId = useSelector((state) => state?.session?.keyAssetId);

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getPet(keyAssetId));
    };

    fetchData();
  }, [dispatch]);

  const selectPet = (pet) => {
    setSelectedPet(pet);
  };

  const handleSelection = () => {
    dispatch(createPet(selectedPet?.petType, selectedName, keyAssetId));
  };

  return (
    <>
      {visitor?.isAdmin && <MobileMenu />}
      <div className="pet-selector-wrapper" style={{ paddingTop: visitor?.isAdmin ? "126px" : undefined }}>
        <div className="pet-selection-container">
          <div className="pet-title">
            <h1>Choose Your Virtual Pet</h1>
          </div>
          <div className="pet-name-selection">
            <span>Name:</span>
            <div style={{ marginBottom: "20px", width: "100%" }}>
              <select value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
                {petNames.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="justify-content-center row">
            {pets.map((pet) => (
              <div key={pet.id} xs={12} sm={6} md={4} className="mb-4 pet-card-margins">
                <div
                  onClick={() => selectPet(pet)}
                  className={`card pet-card ${selectedPet.id === pet.id ? "selected" : ""}`}
                >
                  <div className="no-gutters row">
                    <div className="pet-image-container col-4">
                      <img src={pet.image} alt={pet.name} className="pet-image" />
                    </div>
                    <div className="col-7">
                      <div className="card-body">
                        <h5 tag="h5">{pet.name}</h5>
                        <p style={{ fontSize: "14px" }}>{pet.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="fixed-bottom" style={{ background: "white" }}>
            <button className="topia-default-button" onClick={handleSelection}>
              Choose {selectedPet.name}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PetFirstTimeCreation;
