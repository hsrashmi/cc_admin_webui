import axios from "axios";
import { getConfig } from "../config";

export const fetchSchoolClasses = async (schoolId) => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/schoolClass/${schoolId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching school classes:", error);
    throw new Error("Error fetching school classes.");
  }
};

export const fetchSchools = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(`${config.API_BASE_URL}/school`);
    return response.data;
  } catch (error) {
    console.error("Error fetching school classes:", error);
    throw new Error("Error fetching school classes.");
  }
};
