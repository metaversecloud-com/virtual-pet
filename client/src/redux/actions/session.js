import { session } from "../reducers/session";
import { push } from "redux-first-history";
import axios from "axios";

export const { setVisitor, setDroppedAsset, setPet, setPetAssetOwner, setPetInWorld, setError, setKeyAssetId } =
  session.actions;

const getQueryParams = () => {
  const queryParameters = new URLSearchParams(window.location.search);
  const visitorId = queryParameters.get("visitorId");
  const interactiveNonce = queryParameters.get("interactiveNonce");
  const assetId = queryParameters.get("assetId");
  const interactivePublicKey = queryParameters.get("interactivePublicKey");
  const urlSlug = queryParameters.get("urlSlug");
  const profileId = queryParameters.get("profileId");
  const displayName = queryParameters.get("displayName");
  const identityId = queryParameters.get("identityId");

  return `visitorId=${visitorId}&interactiveNonce=${interactiveNonce}&assetId=${assetId}&interactivePublicKey=${interactivePublicKey}&urlSlug=${urlSlug}&profileId=${profileId}&displayName=${displayName}&identityId=${identityId}`;
};

export const getVisitor = () => async (dispatch) => {
  try {
    const queryParams = getQueryParams();

    const response = await axios.get(`/backend/visitor?${queryParams}`);

    if (response.status === 200) {
      dispatch(setVisitor(response.data.visitor));
    }
  } catch (error) {
    dispatch(setError("There was an error when getting the user content."));
    if (error.response && error.response.data) {
    } else {
    }
  }
};

export const executeAction = (action, keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet/action?${queryParams}`;
    const response = await axios.post(url, { action, keyAssetId });

    if (response.status === 200) {
      dispatch(setPet(response?.data?.pet));
      return true;
    }
  } catch (error) {
    dispatch(setError("There was an error while training the pet"));
    if (error.response && error.response.data) {
    } else {
    }
    return false;
  }
};

export const spawnPet = (keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet/spawn?${queryParams}`;
    const response = await axios.post(url, { keyAssetId });

    if (response.status === 200) {
      dispatch(getPet(keyAssetId));
      dispatch(setPetInWorld(true));
    }
  } catch (error) {
    dispatch(setError("There was an error while spawning the pet"));
    if (error.response && error.response.data) {
    } else {
    }
    return false;
  }
};

export const pickupPet = (isSpawnedDroppedAsset, keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet/pickup?${queryParams}&isSpawnedDroppedAsset=${isSpawnedDroppedAsset}`;
    const response = await axios.post(url, { keyAssetId });

    if (response.status === 200) {
      await dispatch(getPet(keyAssetId));
      await dispatch(setPetInWorld(false));
    }
  } catch (error) {
    dispatch(setError("There was an error while picking up the pet"));
  }
};

export const getPet = (keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet?${queryParams}${keyAssetId && `&keyAssetId=${keyAssetId}`}`;

    const response = await axios.get(url);
    const pet = response?.data?.pet;
    const visitor = response?.data?.visitor;
    const isPetAssetOwner = response?.data?.isPetAssetOwner;
    dispatch(setVisitor(visitor));
    if (response.status === 200) {
      if (!pet) {
        return dispatch(push(`/pet-selector?${queryParams}`));
      }
      dispatch(setPet(pet));
      dispatch(setPetAssetOwner(isPetAssetOwner));
    }
  } catch (error) {
    console.error("error", error);
  }
};

export const createPet = (petType, name, keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet?${queryParams}`;

    const response = await axios.post(url, { petType, name, keyAssetId });
    const pet = response?.data?.pet;
    if (response.status === 200) {
      if (!pet) {
        return dispatch(push(`/pet-selector?${queryParams}`));
      }
      dispatch(setPet(response?.data?.pet));
      return dispatch(push(`/?${queryParams}`));
    }
  } catch (error) {
    console.error("error", error);
    if (error.response && error.response.data) {
    } else {
    }
  }
};

export const updatePet = (name, color, keyAssetId, pet) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet?${queryParams}`;

    const response = await axios.put(url, { name, color, keyAssetId, pet });
    dispatch(setPet(response?.data?.pet));
    dispatch(setPetInWorld(true));
  } catch (error) {
    console.error("error", error);
  }
};

export const namePet = (name) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet/name?${queryParams}`;

    const response = await axios.post(url, { name });
    const pet = response?.data?.pet;
    if (response.status === 200) {
      if (!pet) {
        return dispatch(push(`/pet-selector?${queryParams}`));
      }
      dispatch(setPet(response?.data?.pet));
      return dispatch(push(`/?${queryParams}`));
    }
  } catch (error) {
    console.error("Error Naming the pet", JSON.stringify(error));
    if (error.response && error.response.data) {
    } else {
    }
  }
};

export const tradePet = (keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/pet?${queryParams}${keyAssetId && `&keyAssetId=${keyAssetId}`}`;

    const response = await axios.delete(url);
    const pet = response?.data?.pet;
    if (response.status === 200) {
      if (!pet) {
        return dispatch(push(`/pet-selector?${queryParams}`));
      }
      dispatch(setPet(response?.data?.pet));
      return dispatch(push(`/?${queryParams}`));
    }
  } catch (error) {
    console.error("error", error);
    if (error.response && error.response.data) {
    } else {
    }
  }
};

export const deleteAll = (keyAssetId) => async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/world/pet?${queryParams}`;

    const response = await axios.delete(url, { keyAssetId });
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("error", error);
    if (error.response && error.response.data) {
    } else {
    }
  }
};

export const getKeyAssetId = async (dispatch) => {
  try {
    const queryParams = getQueryParams();
    const url = `/backend/world/key-asset?${queryParams}`;

    const response = await axios.get(url);
    return dispatch(setKeyAssetId(response.data?.keyAssetId));
  } catch (error) {
    console.error("error", error);
  }
};

export const setKeyAsset = async (dispatch) => {
  try {
    const queryParameters = new URLSearchParams(window.location.search);
    return dispatch(setKeyAssetId(queryParameters.get("assetId")));
  } catch (error) {
    console.error("error", error);
  }
};
