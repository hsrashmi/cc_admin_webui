import axios from "axios";
import { getConfig } from "../config";
import { extractErrorMessage } from "../components/Utilities/UtilFuncs";

export const fetchRegions = async () => {
  const config = getConfig();
  try {
    const [statesRes, zonesRes] = await Promise.all([
      axios.get(`${config.API_BASE_URL}/state/`),
      axios.get(`${config.API_BASE_URL}/zone/`),
    ]);

    return statesRes.data.map((state) => ({
      ...state,
      zones: zonesRes.data.filter((zone) => zone.state_id === state.id),
    }));
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school details"),
      details: error.message,
    };
  }
};

export const fetchResponsibleUsers = async (level, id) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/userRolesByHeirarchy/`,
      {
        params: {
          level_name: level.toUpperCase(),
          level_id: id,
        },
      }
    );
    return response.data;
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school details"),
      details: error.message,
    };
  }
};

export const fetchDistricts = async (zoneId) => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/district/`);
    return response.data.filter((d) => d.zone_id === zoneId);
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school details"),
      details: error.message,
    };
  }
};

export const fetchBlocks = async (districtId) => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/block/`);
    return response.data.filter((b) => b.district_id === districtId);
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch school details"),
      details: error.message,
    };
  }
};

export const deleteRegion = async (level, id) => {
  const config = getConfig();
  try {
    await axios.delete(`${config.API_BASE_URL}/${level}/${id}`);
  } catch (error) {
    throw new Error(`Failed to delete ${level}`, error);
  }
};

export const addRegion = async (level, data) => {
  const config = getConfig();
  try {
    const response = await axios.post(`${config.API_BASE_URL}/${level}/`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to add ${level}`, error);
  }
};

export const updateRegion = async (level, id, data) => {
  const config = getConfig();
  try {
    await axios.put(`${config.API_BASE_URL}/${level}/${id}`, data);
  } catch (error) {
    throw new Error(`Failed to update ${level}`, error);
  }
};
