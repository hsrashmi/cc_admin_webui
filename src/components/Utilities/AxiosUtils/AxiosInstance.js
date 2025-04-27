import axios from "axios";
import { getConfig } from "../config";
// import { getRefreshToken, setNewTokens } from './authUtils'; // Token utilities

const config = getConfig();
// Create an Axios instance
const AxiosInstance = axios.create({
  baseURL: `${config.API_BASE_URL}/`, // API base URL
  timeout: config.API_TIMEOUT, // request timeout in milliseconds
});

// Add a response interceptor
AxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (!response) {
      return Promise.reject({
        message: "Network Error. Please check your internet connection.",
        status: null,
      });
    }

    // TODO: Handle token refresh logic when supported by the backend
    // if (error.response && error.response.status === 401) {
    //   try {
    //     const refreshToken = getRefreshToken();
    //     const res = await axios.post("/auth/refresh", {
    //       refresh_token: refreshToken,
    //     });
    //     setNewTokens(res.data);

    //     error.config.headers.Authorization = `Bearer ${res.data.access_token}`;
    //     return AxiosInstance.request(error.config);
    //   } catch (refreshError) {
    //     window.location.href = "/login";
    //     return Promise.reject(refreshError);
    //   }
    // }

    if (response.status === 401) {
      //   // Clear tokens if the backend employs token-based authentication
      //   localStorage.removeItem("token");
      //   sessionStorage.removeItem("token");
      localStorage.removeItem("authenticated");
      sessionStorage.removeItem("authenticated");

      // Redirect to login
      history.push("/login");
      window.location.reload(); // 👈 optional, to fully reset app state

      return Promise.reject({
        message: "Unauthorized. Redirecting to login.",
        status: 401,
      });
    }

    const errorData = {
      status: response.status,
      message: response.data?.message || defaultErrorMessage(response.status),
      data: response.data,
    };

    return Promise.reject(errorData);
  }
);

function defaultErrorMessage(status) {
  switch (status) {
    case 400:
      return "Bad Request.";
    case 403:
      return "Forbidden.";
    case 404:
      return "Resource Not Found.";
    case 500:
      return "Server Error.";
    default:
      return "Unexpected Error.";
  }
}

export default AxiosInstance;
