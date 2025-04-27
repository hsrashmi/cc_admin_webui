import { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Avatar,
  Stack,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import ManageRoles from "./ManageRolesSection";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import {
  fetchUserById,
  fetchUserProfilePic,
  fetchUserRoles,
  createUser,
  updateUser,
  deleteUserProfilePic,
  fetchGenderOptions,
} from "../../services/UserService";
import SnackbarUI from "../Utilities/SnackbarUI";

const AddEditUser = () => {
  const { username } = useParams() || "";
  const user = JSON.parse(sessionStorage.getItem("editUser"));
  const navigate = useNavigate();
  const mode = username ? "edit" : "add";
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    username: "",
    phone1: "",
    phone2: "",
    address: "",
    city: "",
    state: "",
    country: "",
    pin_code: "",
    profile_pic_file: null,
  });
  const inputTypeMap = {
    phone1: "number",
    phone2: "number",
    pin_code: "number",
    // Add other fields with specific types as needed
  };
  const [loading, setLoading] = useState(true);
  const [genderOptions, setGenderOptions] = useState([]);
  const [originalUserData, setOriginalUserData] = useState({});
  const [preview, setPreview] = useState(null);
  const [originalUserRoles, setOriginalUserRoles] = useState([]);
  const fileInputRef = useRef(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  console.log("snackbar", snackbar);
  useEffect(() => {
    const fetchTypes = async () => {
      const response = await fetchGenderOptions();
      if (response.success) {
        setGenderOptions(response.data.genderenum);
      } else {
        setSnackbar({
          open: true,
          message: response.error,
          severity: "error",
        });
      }
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const [userResponse, rolesResponse] = await Promise.all([
        fetchUserById(user.id),
        fetchUserRoles(user.id),
      ]);

      if (userResponse.success) {
        setOriginalUserData(userResponse.data);
        setFormData((prevFormData) => {
          return Object.fromEntries(
            Object.entries(userResponse.data).filter(
              ([key]) => key in prevFormData
            )
          );
        });

        if (userResponse.data.profile_pic_url) {
          const profilePicResponse = await fetchUserProfilePic(user.id);
          if (profilePicResponse.success) {
            setPreview(URL.createObjectURL(profilePicResponse.data));
          }
        }
      } else {
        console.log("userResponse.error", userResponse.error);
        setSnackbar({
          open: true,
          message: userResponse.error,
          severity: "error",
        });
      }

      if (rolesResponse.success) {
        setOriginalUserRoles(rolesResponse.data);
      } else {
        console.log("rolesResponse.error", rolesResponse.error);
        setSnackbar({
          open: true,
          message: rolesResponse.error,
          severity: "error",
        });
      }
      setLoading(false);
    };
    if (username) {
      fetchUserData();
    } else setLoading(false);
  }, [user, username]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, profile_pic_file: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        const response = await updateUser(user.id, formData);
        if (response.success) {
          console.log("User updated successfully!");
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      } else {
        const response = await createUser(formData);
        if (response.success) {
          navigate(`/user/edit/${response.data.id}`);
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      }
    } catch (error) {
      console.error("User update failed:", error);
    }
  };

  const resetAllValues = () => {
    setFormData({
      first_name: mode === "edit" ? originalUserData.first_name : "",
      last_name: mode === "edit" ? originalUserData.last_name : "",
      gender: mode === "edit" ? originalUserData.gender : "",
      email: mode === "edit" ? originalUserData.email : "",
      username: mode === "edit" ? originalUserData.username : "",
      phone1: mode === "edit" ? originalUserData.phone1 : "",
      phone2: mode === "edit" ? originalUserData.phone2 : "",
      address: mode === "edit" ? originalUserData.address : "",
      city: mode === "edit" ? originalUserData.city : "",
      state: mode === "edit" ? originalUserData.state : "",
      country: mode === "edit" ? originalUserData.country : "",
      pin_code: mode === "edit" ? originalUserData.pin_code : "",
      profile_pic_file:
        mode === "edit" ? originalUserData.profile_pic_file : null,
    });
  };

  const formatLabel = (field) => {
    return field
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleDeleteProfilePic = async () => {
    if (username) {
      const response = await deleteUserProfilePic(user.id);
      if (response.success) {
        setFormData({ ...formData, profile_pic_file: null });
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        setSnackbar({
          open: true,
          message: response.error,
          severity: "error",
        });
      }
    } else {
      setFormData({ ...formData, profile_pic_file: null });
      setPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        {username ? `Update User - ${user.name}` : "Add New User"}
      </Typography>
      {!loading ? (
        <Paper sx={{ padding: 4 }}>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map(
              (field) =>
                field !== "profile_pic_file" &&
                field !== "gender" && (
                  <TextField
                    key={field}
                    fullWidth
                    label={formatLabel(field)}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    margin="normal"
                    required={
                      ![
                        "phone2",
                        "address",
                        "city",
                        "state",
                        "country",
                        "pincode",
                      ].includes(field)
                    }
                    type={inputTypeMap[field] || "text"} // Set input type based on mapping
                  />
                )
            )}

            <FormControl fullWidth margin="normal">
              <InputLabel>Gender</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                {genderOptions.map((gender) => (
                  <MenuItem key={gender} value={gender}>
                    {gender}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel shrink>Profile Picture</InputLabel>
              <Stack direction="row" spacing={2} alignItems="center">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Avatar
                  src={preview || ""}
                  alt="Profile Preview"
                  sx={{ width: 80, height: 80 }}
                >
                  {!preview && "P"}
                </Avatar>
                {preview && (
                  <Button color="error" onClick={handleDeleteProfilePic}>
                    <Close />
                    Delete Pic
                  </Button>
                )}
              </Stack>
            </FormControl>
            {mode == "edit" && (
              <ManageRoles originalRoles={originalUserRoles} userId={user.id} />
            )}

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Button
                  type="button"
                  variant="contained"
                  color="secondary"
                  onClick={resetAllValues}
                  sx={{ mt: 3, width: "100%", color: "primary.main" }}
                >
                  Reset
                </Button>
              </Grid>
              <Grid item size={{ xs: 12, md: 6 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, width: "100%", color: "secondary.main" }}
                >
                  {mode === "edit" ? "Update" : "Submit"}
                </Button>
              </Grid>
            </Grid>
          </form>
          {snackbar.open && (
            <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
          )}
        </Paper>
      ) : (
        <Typography variant="h4" gutterBottom>
          Loading.......
        </Typography>
      )}
    </Container>
  );
};

export default AddEditUser;
