import { useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  CircularProgress,
  Stack,
} from "@mui/material";
import { useAuth } from "../services/AuthContext";
import { loginUser } from "../services/LoginService";

const Login = ({ setAuthenticated }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const data = await loginUser(username, password);
      console.log("logged ", data);
      if (data) {
        login(data);
        setAuthenticated(true);
        localStorage.setItem("authenticated", true);
        navigate("/home");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      console.log("error ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="flex items-center justify-center min-h-screen">
      <Paper elevation={3} sx={{ width: "400px" }}>
        <Stack spacing={1} sx={{ p: 1, m: 1 }}>
          <Typography variant="h5" className="mb-4 text-center">
            Login
          </Typography>

          <TextField
            label="Username"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mb-4"
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4"
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            fullWidth
            onClick={async (e) => {
              e.preventDefault(); // Prevents unintended browser behaviors
              console.log("Login clicked");
              await handleLogin(); // Your async function
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
          {error && (
            <Typography color="error" className="mb-2">
              {error}
            </Typography>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

Login.propTypes = {
  setAuthenticated: PropTypes.func.isRequired,
};

export default Login;
