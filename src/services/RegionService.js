import { getAxiosInstance } from "../components/Utilities/AxiosUtils/AxiosInstance";
import { apiRequest } from "../components/Utilities/UtilFuncs";

export const fetchRegions = () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const [statesRes, zonesRes] = await Promise.all([
      axios.get(`state/`),
      axios.get(`zone/`),
    ]);
    return statesRes.data.map((state) => ({
      ...state,
      zones: zonesRes.data.filter((zone) => zone.state_id === state.id),
    }));
  }, "Failed to fetch regions");
};

export const fetchResponsibleUsers = (level, id) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`userRolesByHeirarchy/`, {
      params: {
        level_name: level.toUpperCase(),
        level_id: id,
      },
    });
    return response.data;
  }, "Failed to fetch responsible users");
};

export const fetchDistricts = (zoneId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`district/`);
    return response.data.filter((d) => d.zone_id === zoneId);
  }, "Failed to fetch districts");
};

export const fetchBlocks = (districtId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`block/`);
    return response.data.filter((b) => b.district_id === districtId);
  }, "Failed to fetch blocks");
};

export const deleteRegion = (level, id) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    await axios.delete(`${level}/${id}`);
    return null;
  }, `Failed to delete ${level}`);
};

export const addRegion = (level, data) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`${level}/`, data);
    return response.data;
  }, `Failed to add ${level}`);
};

export const updateRegion = (level, id, data) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    await axios.put(`${level}/${id}`, data);
    return null;
  }, `Failed to update ${level}`);
};
