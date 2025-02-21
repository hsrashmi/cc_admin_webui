import { createTheme } from "@mui/material/styles";

// Function to get CSS variable value
const getCSSVariable = (variable) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

// Fetch colors from CSS variables
const primaryColor = getCSSVariable("--primary-color") || "#1e3a8a"; // Default fallback
const secondaryColor = getCSSVariable("--secondary-color") || "#f59e0b";

const theme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: secondaryColor,
    },
  },
});

export default theme;
