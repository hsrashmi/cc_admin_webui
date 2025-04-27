import axios from "axios";
import { getConfig } from "../config";
import { extractErrorMessage } from "../components/Utilities/UtilFuncs";

export const loginUser = async (email, password) => {
  const config = getConfig();
  try {
    const response = await axios.post(`${config.API_BASE_URL}/login`, {
      email,
      password,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Login failed. Please try again."),
      details: error.message,
    };
  }
};

export const fetchAllUsersDetails = async (params) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/allIlpusersWithRoles`,
      params
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch users details"),
      details: error.message,
    };
  }
};

export const fetchAllUsersDetailsCount = async (params) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/allIlpusersWithRolesCount`,
      params
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch users count details"),
      details: error.message,
    };
  }
};

export const fetchUserById = async (userId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/ilpuser/${userId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch user details"),
      details: error.message,
    };
  }
};

export const fetchUserProfilePic = async (userId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/${userId}/profile-pic`,
      { responseType: "blob" }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch profile picture"),
      details: error.message,
    };
  }
};

export const fetchUserRoles = async (userId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/userRole/${userId}`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch user roles"),
      details: error.message,
    };
  }
};

export const createUser = async (userData) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/ilpuser/`,
      userData
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to create user"),
      details: error.message,
    };
  }
};

export const updateUser = async (userId, userData) => {
  const config = getConfig();
  try {
    const response = await axios.put(
      `${config.API_BASE_URL}/ilpuser/${userId}`,
      userData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to update user"),
      details: error.message,
    };
  }
};

export const deleteUserProfilePic = async (userId) => {
  const config = getConfig();
  try {
    await axios.delete(`${config.API_BASE_URL}/${userId}/profile-pic`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to delete profile picture"),
      details: error.message,
    };
  }
};

export const deleteUserRole = async (roleId) => {
  const config = getConfig();
  try {
    await axios.delete(`${config.API_BASE_URL}/userRole/${roleId}`);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to delete user role"),
      details: error.message,
    };
  }
};

export const createUserRoles = async (rolesData) => {
  const config = getConfig();
  try {
    const responses = await Promise.all(
      rolesData.map((role) =>
        axios.post(`${config.API_BASE_URL}/userRole`, role)
      )
    );
    return { success: true, data: responses.map((r) => r.data) };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to create user roles"),
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
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch responsible users"),
      details: error.message,
    };
  }
};

export const fetchAllRoles = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/role/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch role names"),
      details: error.message,
    };
  }
};

export const fetchAllStates = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/state/`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch state names"),
      details: error.message,
    };
  }
};

export const fetchGenderOptions = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/getTypesValues/genderenum`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch gender options"),
      details: error.message,
    };
  }
};

export const fetchAccessTypeOptions = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/getTypesValues/accesstypeenum`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to fetch gender options"),
      details: error.message,
    };
  }
};

export const bulkUploadUserData = async (file) => {
  const config = getConfig();
  try {
    const response = await axios.post(
      `${config.API_BASE_URL}/bulkUploadUserData`,
      file,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return { success: true, data: response.data };
  } catch (error) {
    console.log("error ", error);
    return {
      success: false,
      error: extractErrorMessage(error, "Failed to upload data"),
      details: error.message,
    };
  }
};
