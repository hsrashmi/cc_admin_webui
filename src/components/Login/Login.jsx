import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useAuth } from "../../services/AuthContext";
import { loginUser } from "../../services/LoginService";
import SnackbarUI from "../Utilities/SnackbarUI";

const Login = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const handleLogin = async () => {
    setSnackbar({ ...snackbar, open: false });
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      if (data) {
        login(data);
        setAuthenticated(true);
        localStorage.setItem("authenticated", true);
        navigate("/home");
      } else {
        setSnackbar({
          open: true,
          message: "Invalid credentials",
          severity: "error",
        });
      }
    } catch (err) {
      console.log("error ", err);
      setSnackbar({
        open: true,
        message: err.message || "An error occurred during login",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen">
      <div>
        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96">
          <Stack spacing={2} sx={{ p: 1, m: 1 }}>
            <Typography variant="h5" className="mb-6 text-center">
              Login
            </Typography>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleLogin}
              disabled={loading}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : "Login"}
            </Button>
          </Stack>
        </div>
        <img
          src="src/assets/login_page_pic.svg"
          alt="logo"
          className="w-full"
        />
      </div>
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </Box>
  );
};

Login.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
};

export default Login;
