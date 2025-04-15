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
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      extractErrorMessage(error, "Login failed. Please try again.")
    );
  }
};
