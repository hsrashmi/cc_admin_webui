import { loginUser } from "./UserService";

export const login = async (email, password) => {
  const response = await loginUser(email, password);
  if (response.success) {
    return response.data;
  }
  throw new Error(response.error);
};
