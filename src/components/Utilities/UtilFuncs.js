export const extractErrorMessage = (
  error,
  fallback = "Something went wrong!"
) => {
  // 1. Handle network errors
  if (error?.message === "Network Error") {
    return "Network error. Please check your internet connection.";
  }

  // 2. Handle server errors - generic status codes
  // if (error?.response?.status === 500) {
  //   return "Server error. Please try again later.";
  // } else if (error?.response?.status === 404) {
  //   return "Resource not found.";
  // } else if (error?.response?.status === 401) {
  //   return "Unauthorized access. Please log in again.";
  // } else if (error?.response?.status === 403) {
  //   return "Forbidden access. You do not have permission to perform this action.";
  // } else if (error?.response?.status === 400) {
  //   return "Bad request. Please check your input.";
  // } else if (error?.response?.status === 422) {
  //   return "Validation error. Please check your input.";
  // } else if (error?.response?.status === 408) {
  //   return "Request timed out. Please try again.";
  // } else if (error?.response?.status === 429) {
  //   return "Too many requests. Please try again later.";
  // } else if (error?.response?.status === 503) {
  //   return "Service unavailable. Please try again later.";
  // } else if (error?.response?.status === 504) {
  //   return "Gateway timeout. Please try again later.";
  // }

  // 2. Handle specific server error messages
  if (
    error.response?.data?.detail &&
    Array.isArray(error.response.data.detail)
  ) {
    return error.response.data.detail.msg.join(", ");
  } else if (
    error.response?.data?.errors &&
    Array.isArray(error.response.data.errors)
  ) {
    return error.response.data.errors.join(", ");
  }

  // 3. Handle generic JS errors
  if (error?.message) {
    return error.message;
  }
  return fallback;
};

export const createSlug = (name) => name.toLowerCase().replace(/\s+/g, "-");

export async function apiWrapper(apiCall) {
  try {
    const data = await apiCall();
    return { success: true, data, error: null };
  } catch (error) {
    console.error("API Error:", error);
    return { success: false, data: null, error };
  }
}
