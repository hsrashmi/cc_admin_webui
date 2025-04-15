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
import axios from "axios";
import { useParams } from "react-router-dom";
import ManageRoles from "./ManageRolesSection";
import { Close } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const AddEditUser = () => {
  const userId = useParams().id || "";
  const navigate = useNavigate();

  const mode = userId ? "edit" : "add";
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    email: "",
    username: "",
    password: "",
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

  useEffect(() => {
    const fetchTypes = async () => {
      const types = "genderenum";
      const typesValuesResponse = await axios.get(
        `http://localhost:8000/ilp/v1/getTypesValues/${types}`
      );
      setGenderOptions(typesValuesResponse.data.genderenum);
    };
    fetchTypes();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const responseUser = await axios.get(
        `http://localhost:8000/ilp/v1/ilpuser/${userId}`
      );
      setOriginalUserData(responseUser.data);
      setFormData((prevFormData) => {
        return Object.fromEntries(
          Object.entries(responseUser.data).filter(
            ([key]) => key in prevFormData
          )
        );
      });

      if (responseUser.data.profile_pic_url) {
        const responseProfilePic = await axios.get(
          `http://localhost:8000/ilp/v1/${userId}/profile-pic`,
          { responseType: "blob" }
        );
        setPreview(URL.createObjectURL(responseProfilePic.data));
      }
      const responseUserRoles = await axios.get(
        `http://localhost:8000/ilp/v1/userRole/${userId}`
      );
      setOriginalUserRoles(responseUserRoles.data);
      setLoading(false);
    };
    if (userId) {
      fetchUserData();
    } else setLoading(false);
  }, [userId]);

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
        await axios.put(
          `http://localhost:8000/ilp/v1/ilpuser/${userId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("User updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:8000/ilp/v1/ilpuser/",
          formData
        );
        // Extract the user ID from the response data
        const newUserId = response.data.id;

        // Navigate to the new user's detail page
        navigate(`/user/edit/${newUserId}`);
      }
    } catch (error) {
      console.error("User update failed:", error);
    }
  };

  const resetAllValues = () => {
    if (mode === "edit") setFormData(originalUserData);
    else
      setFormData({
        first_name: "",
        last_name: "",
        gender: "",
        email: "",
        username: "",
        password: "",
        phone1: "",
        phone2: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pin_code: "",
        profile_pic_file: null,
      });
  };

  const formatLabel = (field) => {
    return field
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleDeleteProfilePic = async () => {
    if (userId) {
      try {
        await axios.delete(
          `http://localhost:8000/ilp/v1/${userId}/profile-pic`
        );
        setFormData({ ...formData, profile_pic_file: null });
        setPreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } catch (error) {
        console.error("Error deleting profile picture:", error);
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
      <Typography variant="h4" gutterBottom>
        {userId ? "Update User" : "Add New User"}
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
              <ManageRoles originalRoles={originalUserRoles} userId={userId} />
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
