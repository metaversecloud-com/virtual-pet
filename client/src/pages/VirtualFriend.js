import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ClipLoader } from "react-spinners";
import "./VirtualFriend.scss";
import { getVisitor, getPet } from "../redux/actions/session";
import { getLevel } from "./utils.js";

import Pet from "../components/pets/pet";
import MobileMenu from "../components/mobileMenu/MobileMenu";

const VirtualFriend = () => {
  const dispatch = useDispatch();
  const [level, setLevel] = useState(0);
  const [loading, setLoading] = useState(true);

  const pet = useSelector((state) => state?.session?.pet);
  const visitor = useSelector((state) => state?.session?.visitor);
  const petType = pet?.petType;

  useEffect(() => {
    const fetchData = async () => {
      await dispatch(getVisitor());
      await dispatch(getPet());
      setLoading(false); // set loading to false after data is loaded
    };

    fetchData();
  }, [dispatch]);

  useEffect(() => {
    const currentPetExperience = pet?.experience || 0;
    const { currentLevel } = getLevel(currentPetExperience);

    setLevel(currentLevel);
  }, [pet, petType]);

  const getPetComponent = () => {
    if (level === 1) {
      return <Pet petAge="baby" />;
    }
    if (level === 2) {
      return <Pet petAge="teen" />;
    }
    if (level >= 3) {
      return <Pet petAge="adult" />;
    } else {
      return <Pet />;
    }
  };

  if (loading) {
    return (
      <div className="loader">
        <ClipLoader color={"#123abc"} loading={loading} size={150} />
      </div>
    ); // return a loading spinner
  }

  return (
    <div className="virtual-friend-wrapper">
      {getPetComponent()}

      {visitor?.isAdmin && <MobileMenu />}
    </div>
  );
};

export default VirtualFriend;
