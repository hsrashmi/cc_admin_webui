export const extractErrorMessage = (
  error,
  fallback = "Something went wrong!"
) => {
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
  return fallback;
};
