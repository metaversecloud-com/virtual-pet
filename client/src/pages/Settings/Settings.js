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

  const handleDeleteAllPets = async () => {
    try {
      setIsLoading(true);
      await dispatch(deleteAll());
      setIsSuccess(true);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6 mx-auto">
            <h3 className="text-center" style={{ textAlign: "center" }}>
              Settings
            </h3>
            <div
              className="input-group"
              style={{ textAlign: "center", margin: "10px 0px" }}
            >
              <button
                className="btn btn-primary topia-default-button"
                onClick={handleDeleteAllPets}
                disabled={isLoading}
                style={{ margin: "0 auto" }}
              >
                {isLoading ? "Loading..." : "Pick up all pets"}
              </button>
            </div>
            {isSuccess && !error && (
              <div
                className="mt-2 text-success"
                style={{ textAlign: "center" }}
              >
                All pets removed from world!
              </div>
            )}
            {error && (
              <div className="mt-2 text-danger">
                There was an error deleting all pets
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileMenu />
    </div>
  );
};

export default Settings;
