import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteAll } from "../../redux/actions/session";
import "./Settings.scss";
import MobileMenu from "../../components/mobileMenu/MobileMenu";

const Settings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const error = useSelector((state) => state?.session?.error);
  const dispatch = useDispatch();

  const keyAssetId = useSelector((state) => state?.session?.keyAssetId);

  const handleDeleteAllPets = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteAll(keyAssetId));
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-wrapper">
      <h3>Settings</h3>
      {keyAssetId ? (
        <div className="input-group">
          <button
            className="btn btn-primary topia-default-button"
            onClick={handleDeleteAllPets}
            disabled={isLoading}
            style={{ margin: "0 auto" }}
          >
            {isLoading ? "Loading..." : "Pick up all pets"}
          </button>
        </div>
      ) : (
        <p>Unable to find key asset with unique name "virtualPetKeyAsset".</p>
      )}
      {isSuccess && !error && (
        <div className="mt-2 text-success" style={{ textAlign: "center" }}>
          All pets removed from world!
        </div>
      )}
      {error && <div className="mt-2 text-danger">There was an error deleting all pets</div>}
      <MobileMenu />
    </div>
  );
};

export default Settings;
