import { getAxiosInstance } from "../components/Utilities/AxiosUtils/AxiosInstance";
import { apiRequest } from "../components/Utilities/UtilFuncs";

export const loginUser = async (email, password) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`/login`, {
      email,
      password,
    });
    return response.data;
  }, "Login failed. Please try again.");
};

export const fetchAllUsersDetails = async (params) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`/allIlpusersWithRoles`, params);
    return response.data;
  }, "Failed to fetch users details");
};

export const fetchAllUsersDetailsCount = async (params) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`/allIlpusersWithRolesCount`, params);
    return response.data;
  }, "Failed to fetch users count details");
};

export const fetchUserById = async (userId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/ilpuser/${userId}`);
    return response.data;
  }, "Failed to fetch user details");
};

export const fetchUserProfilePic = async (userId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/${userId}/profile-pic`, {
      responseType: "blob",
    });
    return response.data;
  }, "Failed to fetch profile picture");
};

export const fetchUserRoles = async (userId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/userRole/${userId}`);
    return response.data;
  }, "Failed to fetch user roles");
};

export const createUser = async (userData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`/ilpuser/`, userData);
    return response.data;
  }, "Failed to create user");
};

export const updateUser = async (userId, userData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.put(`/ilpuser/${userId}`, userData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  }, "Failed to update user");
};

export const deleteUserProfilePic = async (userId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    await axios.delete(`/${userId}/profile-pic`);
    return true;
  }, "Failed to delete profile picture");
};

export const deleteUserRole = async (roleId) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    await axios.delete(`/userRole/${roleId}`);
    return true;
  }, "Failed to delete user role");
};

export const createUserRoles = async (rolesData) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const responses = await Promise.all(
      rolesData.map((role) => axios.post(`/userRole`, role))
    );
    return responses.map((r) => r.data);
  }, "Failed to create user roles");
};

export const fetchResponsibleUsers = async (level, id) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/userRolesByHeirarchy/`, {
      params: {
        level_name: level.toUpperCase(),
        level_id: id,
      },
    });
    return response.data;
  }, "Failed to fetch responsible users");
};

export const fetchAllRoles = async () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/role/`);
    return response.data;
  }, "Failed to fetch role names");
};

export const fetchAllStates = async () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/state/`);
    return response.data;
  }, "Failed to fetch state names");
};

export const fetchGenderOptions = async () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/getTypesValues/genderenum`);
    return response.data;
  }, "Failed to fetch gender options");
};

export const fetchAccessTypeOptions = async () => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.get(`/getTypesValues/accesstypeenum`);
    return response.data;
  }, "Failed to fetch access type options");
};

export const bulkUploadUserData = async (file) => {
  const axios = getAxiosInstance();
  return apiRequest(async () => {
    const response = await axios.post(`/bulkUploadUserData`, file, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }, "Failed to upload data");
};
