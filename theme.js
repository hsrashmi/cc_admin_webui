import { createTheme } from "@mui/material/styles";

// Function to get CSS variable value
const getCSSVariable = (variable) =>
  getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

// Fetch colors from CSS variables
const primaryColor = getCSSVariable("--primary-color") || "#1e3a8a"; // Default fallback
const secondaryColor = getCSSVariable("--secondary-color") || "#f59e0b";

const theme = createTheme({
  components: {
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      // Optionally, add style overrides if you need to adjust other styles
      root: {
        "& .MuiInputBase-root, & .MuiInputLabel-root": {
          fontSize: "0.8rem",
        },
        "& .MuiInputLabel-root.MuiInputLabel-shrink": {
          // With the smaller font size, the shrink effect
          // shouldn't go quite as high ("-6px" instead of "-9px")
          // in order for it to look correct.
          transform: "translate(14px, -6px) scale(0.75)",
        },
      },
      input: {
        // Adjust the font size for the text inside inputs
        fontSize: "0.875rem", // roughly equivalent to a smaller font size
      },
    },
    MuiSelect: {
      defaultProps: {
        // Set the default size to "small" for dropdowns
        size: "small",
      },
      styleOverrides: {
        select: {
          // Adjust the font size for the selected value display
          fontSize: "0.875rem",
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          // Adjust the font size for inputs inside text fields
          fontSize: "0.875rem",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
        },
      },
    },
  },
  typography: {
    fontSize: 12,
    fontFamily: '"Roboto", sans-serif',
  },
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
