import React from "react";
import { HistoryRouter as Router } from "redux-first-history/rr6";
import { history } from "../redux/store";

import { Route, Routes } from "react-router-dom";

import VirtualFriend from "./VirtualFriend";
import MascotFirstTimeCreation from "./MascotFirstTimeCreation/MascotFirstTimeCreation";
import PetNaming from "./MascotFirstTimeCreation/PetNaming";
import Settings from "./Settings/Settings";

const PageRoutes = () => {
  return (
    <Router history={history}>
      <Routes>
        <Route path="/" element={<VirtualFriend />} />
        <Route path="/asset-type/:isSpawnedDroppedAsset" element={<VirtualFriend />} />
        <Route path="/mascot-selector" element={<MascotFirstTimeCreation />} />
        <Route path="/pet-naming" element={<PetNaming />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
};

export default PageRoutes;
