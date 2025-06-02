import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Route, Routes, useNavigate, useSearchParams } from "react-router-dom";

// pages
import Home from "@pages/Home";
import Error from "@pages/Error";

// context
import { GlobalDispatchContext } from "./context/GlobalContext";
import { InteractiveParams, SET_HAS_SETUP_BACKEND, SET_KEY_ASSET_ID } from "./context/types";

// utils
import { backendAPI, setupBackendAPI } from "./utils/backendAPI";
import { setErrorMessage } from "./utils";

const App = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [hasInitBackendAPI, setHasInitBackendAPI] = useState(false);

  const dispatch = useContext(GlobalDispatchContext);
  // const { keyAssetId } = useContext(GlobalStateContext);

  const interactiveParams: InteractiveParams = useMemo(() => {
    return {
      assetId: searchParams.get("assetId") || "",
      displayName: searchParams.get("displayName") || "",
      identityId: searchParams.get("identityId") || "",
      interactiveNonce: searchParams.get("interactiveNonce") || "",
      interactivePublicKey: searchParams.get("interactivePublicKey") || "",
      profileId: searchParams.get("profileId") || "",
      sceneDropId: searchParams.get("sceneDropId") || "",
      uniqueName: searchParams.get("uniqueName") || "",
      urlSlug: searchParams.get("urlSlug") || "",
      username: searchParams.get("username") || "",
      visitorId: searchParams.get("visitorId") || "",
    };
  }, [searchParams]);

  const setHasSetupBackend = useCallback(
    async (success: boolean) => {
      dispatch!({
        type: SET_HAS_SETUP_BACKEND,
        payload: { hasSetupBackend: success },
      });

      if (interactiveParams.assetId) {
        const currentURL = window.location.href;
        const containsString = currentURL.includes("spawned");
        if (containsString) {
          await backendAPI
            .get("/key-asset")
            .then((response) => {
              dispatch!({
                type: SET_KEY_ASSET_ID,
                payload: response.data,
              });
            })
            .catch((error) => setErrorMessage(dispatch, error));
        } else {
          dispatch!({
            type: SET_KEY_ASSET_ID,
            payload: { keyAssetId: interactiveParams.assetId },
          });
        }
      }
    },
    [dispatch],
  );

  const setupBackend = () => {
    setupBackendAPI(interactiveParams)
      .then(() => setHasSetupBackend(true))
      .catch(() => navigate("*"))
      .finally(() => setHasInitBackendAPI(true));
  };

  useEffect(() => {
    if (!hasInitBackendAPI) setupBackend();
  }, [hasInitBackendAPI, interactiveParams]);

  return (
    <Routes>
      <Route path="/" element={<Home isSpawnedDroppedAsset={false} />} />
      <Route path="/asset-type/:isSpawnedDroppedAsset" element={<Home isSpawnedDroppedAsset={true} />} />
      <Route path="*" element={<Error />} />
    </Routes>
  );
};

export default App;
