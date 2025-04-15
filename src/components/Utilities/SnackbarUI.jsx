import { Snackbar, Alert } from "@mui/material";
import PropTypes from "prop-types";

const SnackbarUI = ({ snackbar, setSnackbar }) => {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={() => setSnackbar({ ...snackbar, open: false })}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        severity={snackbar.severity}
        sx={{ width: "100%" }}
      >
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
};

SnackbarUI.propTypes = {
  snackbar: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.oneOf(["success", "error", "warning", "info"]),
  }).isRequired,
  setSnackbar: PropTypes.func.isRequired,
};

export default SnackbarUI;
