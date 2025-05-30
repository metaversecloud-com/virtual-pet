import { useContext, useState } from "react";

// components
import { ConfirmationModal } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";
import { SET_PET_IN_WORLD } from "@/context/types";

// utils
import { backendAPI, setErrorMessage } from "@/utils";

export const AdminView = () => {
  const dispatch = useContext(GlobalDispatchContext);
  const { keyAssetId } = useContext(GlobalStateContext);

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  function handleToggleShowConfirmationModal() {
    setShowConfirmationModal(!showConfirmationModal);
  }

  const handleRemoveDroppedAssets = async () => {
    setAreButtonsDisabled(true);

    backendAPI
      .post("/remove-dropped-assets")
      .then(() => {
        dispatch!({
          type: SET_PET_IN_WORLD,
          payload: {
            isPetInWorld: false,
          },
        });
      })
      .catch((error) => setErrorMessage(dispatch, error))
      .finally(() => {
        setAreButtonsDisabled(false);
      });
  };

  return (
    <div>
      <h3>Settings</h3>
      {keyAssetId ? (
        <button
          className="btn btn-danger mt-8"
          disabled={areButtonsDisabled}
          onClick={() => handleToggleShowConfirmationModal()}
        >
          Pick Up All Pets
        </button>
      ) : (
        <p>Unable to find key asset with unique name "virtualPetKeyAsset".</p>
      )}

      {showConfirmationModal && (
        <ConfirmationModal
          title="Pick Up All Pets"
          message="Are you sure you want to remove all pets from this world? This action cannot be undone."
          handleOnConfirm={handleRemoveDroppedAssets}
          handleToggleShowConfirmationModal={handleToggleShowConfirmationModal}
        />
      )}
    </div>
  );
};

export default AdminView;
