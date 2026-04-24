import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

// components
import { PageContainer, VirtualPet, CreatePet, SelectPet } from "@/components";

// context
import { GlobalDispatchContext, GlobalStateContext } from "@/context/GlobalContext";

// utils
import { backendAPI, setErrorMessage, setGameState } from "@/utils";

const Home = ({ isSpawnedDroppedAsset }: { isSpawnedDroppedAsset: boolean }) => {
  const dispatch = useContext(GlobalDispatchContext);
  const { hasSetupBackend, keyAssetId, pets, selectedPetId } = useContext(GlobalStateContext);
  const [searchParams] = useSearchParams();
  const forceRefreshInventory = searchParams.get("forceRefreshInventory") === "true";

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameState = async () => {
      try {
        let response;
        if (!isSpawnedDroppedAsset) {
          response = await backendAPI.get("/game-state", {
            params: { ...(keyAssetId && { keyAssetId }), forceRefreshInventory },
          });
        } else {
          response = await backendAPI.get("/pet");
        }
        setGameState(dispatch, response.data);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(dispatch, error.message);
        } else {
          setErrorMessage(dispatch, "An unknown error occurred");
        }
      }
      setIsLoading(false);
    };
    if (hasSetupBackend) fetchGameState();
  }, [hasSetupBackend]);

  return (
    <PageContainer isLoading={isLoading}>
      {selectedPetId ? <VirtualPet /> : pets && Object.keys(pets).length > 0 ? <SelectPet /> : <CreatePet />}
    </PageContainer>
  );
};

export default Home;
