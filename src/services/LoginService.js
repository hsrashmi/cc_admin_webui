import axios from "axios";
import { getConfig } from "../config";

export const loginUser = async (email, password) => {
  const config = getConfig();
  console.log(config, "config ");
  try {
    const response = await axios.post(`${config.API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error("Login failed. Please try again.");
  }
};
