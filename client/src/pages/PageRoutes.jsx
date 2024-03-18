import React from "react";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { history } from "../redux/store";

import { Route, Routes } from "react-router-dom";

import VirtualPetMainScreen from "./VirtualPetMainScreen/VirtualPetMainScreen";
import PetFirstTimeCreation from "./PetFirstTimeCreation/PetFirstTimeCreation";
import Settings from "./Settings/Settings";

const PageRoutes = () => {
  return (
    <Router history={history}>
      <Routes>
        <Route path="/" element={<VirtualPetMainScreen />} />
        <Route
          path="/asset-type/:isSpawnedDroppedAsset"
          element={<VirtualPetMainScreen />}
        />
        <Route path="/pet-selector" element={<PetFirstTimeCreation />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
