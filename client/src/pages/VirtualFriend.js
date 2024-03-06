import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "./VirtualFriend.scss";
import { getPet } from "../redux/actions/session";
import { getLevel } from "./utils.js";
import EditPetScreen from "../pages/EditPetScreen/EditPetScreen.js";

import Pet from "../components/pets/pet";
import MobileMenu from "../components/mobileMenu/MobileMenu";

const VirtualFriend = () => {
  const dispatch = useDispatch();
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEditPetScreen, setShowEditPetScreen] = useState(false);

  const pet = useSelector((state) => state?.session?.pet);
  const visitor = useSelector((state) => state?.session?.visitor);
  const petType = pet?.petType;

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getPet());
      setLoading(false);
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const currentPetExperience = pet?.experience || 0;
    const { currentLevel } = getLevel(currentPetExperience);

    setLevel(currentLevel);
  }, [pet, petType]);

  const getPetAge = () => {
    if (level < 5) {
      return "baby";
    }
    if (level >= 5 && level < 10) {
      return "teen";
    }
    if (level >= 10) {
      return "adult";
    } else {
      return "";
    }
  };

  const getPetComponent = () => {
    return (
      <Pet petAge={getPetAge()} setShowEditPetScreen={setShowEditPetScreen} />
    );
  };

  if (loading) {
    return (
      <div className="loader">
        <ClipLoader color={"#123abc"} loading={loading} size={150} />
      </div>
    );
  }

  if (showEditPetScreen) {
    return (
      <EditPetScreen
        setShowEditPetScreen={setShowEditPetScreen}
        petAge={getPetAge()}
      />
    );
  }

  return (
    <div
      className="virtual-friend-wrapper"
      style={{ paddingTop: visitor?.isAdmin ? "80px" : "" }}
    >
      {getPetComponent()}

      {visitor?.isAdmin && <MobileMenu />}
    </div>
  );
};

export default VirtualFriend;
