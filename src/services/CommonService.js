import axios from "axios";
import { getConfig } from "../config";
import { extractErrorMessage } from "../components/Utilities/UtilFuncs";

export const dashboardSummary = async () => {
  const config = getConfig();
  try {
    const response = await axios.get(
      `${config.API_BASE_URL}/dashboard/summary`
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: extractErrorMessage(error, "Dashboard summary fetch failed"),
      details: error.message,
    };
  }
};
