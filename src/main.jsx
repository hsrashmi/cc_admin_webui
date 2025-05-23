import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { loadConfig } from "./config.js";
import { initializeAxiosInstance } from "./components/Utilities/AxiosUtils/AxiosInstance.js";
import { AuthProvider } from "./services/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";

const root = createRoot(document.getElementById("root"));

loadConfig().then(() => {
  initializeAxiosInstance();
  root.render(
    <StrictMode>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </StrictMode>
  );
});
