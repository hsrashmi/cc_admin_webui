import { createContext, useContext, useState } from "react";
import PropTypes from "prop-types";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function - store user in memory
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function - clear user from memory
  const logout = () => {
    setUser(null);
    localStorage.setItem("authenticated", false);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

// Custom hook to access auth state anywhere
export const useAuth = () => useContext(AuthContext);
