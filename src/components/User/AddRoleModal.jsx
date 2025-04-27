import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  Box,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import PropTypes from "prop-types";
import {
  fetchAccessTypeOptions,
  fetchAllRoles,
  fetchAllStates,
} from "../../services/UserService";
import {
  fetchBlocksByDistrict,
  fetchDistrictsByZone,
  fetchSchoolsByBlock,
  fetchZonesByState,
} from "../../services/SchoolService";
import SnackbarUI from "../Utilities/SnackbarUI";

const AddRoleModal = ({ open, onClose, onSave, userId }) => {
  const [accessTypes, setAccessTypes] = useState([]);
  const [roles, setRoles] = useState([]);
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [schools, setSchools] = useState([]);
  const [formData, setFormData] = useState({
    role: "",
    access_type: "",
    state: "",
    zone: "",
    district: "",
    block: "",
    school: "",
    selectedStates: [],
    selectedZones: [],
    selectedDistricts: [],
    selectedBlocks: [],
  });
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchStates = async () => {
    const response = await fetchAllStates();
    if (response.success) {
      setStates(response.data);
    } else {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
    }
  };

  const fetchRoles = async () => {
    const response = await fetchAllRoles();
    if (response.success) {
      setRoles(response.data);
    } else {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
    }
  };

  useEffect(() => {
    async function fetchZones() {
      if (formData.state) {
        const response = await fetchZonesByState(formData.state);
        if (response.success) {
          setZones(response.data);
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      }
    }
    fetchZones();
  }, [formData.state]);

  useEffect(() => {
    async function fetchDistricts() {
      if (formData.zone) {
        const response = await fetchDistrictsByZone(formData.zone);
        if (response.success) {
          setDistricts(response.data);
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      }
    }
    fetchDistricts();
  }, [formData.zone]);

  useEffect(() => {
    async function fetchBlocks() {
      if (formData.district) {
        const response = await fetchBlocksByDistrict(formData.district);
        if (response.success) {
          setBlocks(response.data);
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      }
    }
    fetchBlocks();
  }, [formData.district]);

  useEffect(() => {
    async function fetchSchools() {
      if (formData.block) {
        const response = await fetchSchoolsByBlock(formData.block);
        if (response.success) {
          setSchools(response.data);
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      }
    }
    fetchSchools();
  }, [formData.block]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      const fetchTypes = async () => {
        const typesValuesResponse = await fetchAccessTypeOptions();
        if (typesValuesResponse.success) {
          setAccessTypes(typesValuesResponse.data.accesstypeenum);
        } else {
          setSnackbar({
            open: true,
            message: typesValuesResponse.error,
            severity: "error",
          });
        }
      };

      await fetchTypes();
      await fetchRoles();
      await fetchStates();
      setLoading(false);
    };

    fetchData();
  }, []);

  const getRoleNameById = (roleId) => {
    const selectedRole = roles.find((role) => role.id === roleId);
    return selectedRole ? selectedRole.name : "";
  };

  const roleName = getRoleNameById(formData.role);

  const handleChange = (e) => {
    setError(""); // Clear error for the changed field
    const { name, value } = e.target;

    setFormData((prevData) => {
      let updatedData = { ...prevData, [name]: value };

      // Reset fields based on the hierarchyselectedschools: []
      if (name === "state") {
        updatedData = {
          ...updatedData,
          selectedZones: [],
          selectedDistricts: [],
          selectedBlocks: [],
          school: "",
          zone: "",
          district: "",
          block: "",
        };
      }

      if (name === "zone") {
        updatedData = {
          ...updatedData,
          selectedDistricts: [],
          selectedBlocks: [],
          school: "",
          district: "",
          block: "",
        };
      }

      if (name === "district") {
        updatedData = {
          ...updatedData,
          selectedBlocks: [],
          school: "",
          block: "",
        };
      }

      if (name === "block") {
        updatedData = {
          ...updatedData,
          school: "",
        };
      }

      return updatedData;
    });
  };

  const handleSave = () => {
    console.log("-------- formData ----------- ", formData);
    if (!validateForm()) return;
    const roleData = generateRoleAssignments();
    onSave(roleData);
    onClose();
  };

  function generateRoleAssignments() {
    const levelMap = {
      selectedStates: "STATE",
      selectedZones: "ZONE",
      selectedDistricts: "DISTRICT",
      selectedBlocks: "BLOCK",
    };
    // Special case for teacher/student: single school via dropdown
    if (roleName === "TEACHER" || roleName === "STUDENT") {
      if (formData.school) {
        return [
          {
            user_id: userId,
            role_id: formData.role,
            access_type: formData.access_type,
            level: "SCHOOL",
            level_id: formData.school,
          },
        ];
      }
    } else if (roleName === "ROOT") {
      return [
        {
          user_id: userId,
          role_id: formData.role,
          access_type: formData.access_type,
          level: "ROOT",
          level_id: null,
        },
      ];
    } else {
      for (const [key, level] of Object.entries(levelMap)) {
        if (formData[key] && formData[key].length > 0) {
          return formData[key].map((levelId) => ({
            user_id: userId,
            role_id: formData.role,
            access_type: formData.access_type,
            level: level,
            level_id: levelId,
          }));
        }
      }
    }

    return []; // No assignments
  }

  const [error, setError] = useState("");

  const validateForm = () => {
    var errorMessage = "";
    if (!formData.role) errorMessage = "Role is required";
    else if (!formData.access_type) errorMessage = "Access type is required";
    else if (
      roleName === "STATE_MANAGER" &&
      formData.selectedStates.length === 0
    ) {
      errorMessage = "Please select at least one state";
    } else if (roleName === "ZONE_MANAGER") {
      if (formData.selectedZones.length === 0)
        errorMessage = "Please select at least one zone";
    } else if (roleName === "DISTRICT_MANAGER") {
      if (formData.selectedDistricts.length === 0)
        errorMessage = "Please select at least one district";
    } else if (roleName === "BLOCK_MANAGER") {
      if (formData.selectedBlocks.length === 0)
        errorMessage = "Please select at least one block";
    } else if (roleName === "TEACHER" || roleName === "STUDENT") {
      console.log("formData.selectedSchools 9999999999 ", formData.school);
      if (formData.school === "") errorMessage = "Please select a school";
    }
    setError(errorMessage);
    return errorMessage === "";
  };

  return (
    <Dialog open={open.toString()} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Role</DialogTitle>
      {!loading ? (
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Role *</InputLabel>
            <Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {roles.map((role) => (
                <MenuItem key={role.id} value={role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl component="fieldset" margin="normal">
            <Box display="flex" alignItems="center" margin="normal">
              <FormLabel component="legend">Access Type *</FormLabel>
              <RadioGroup
                name="access_type"
                value={formData.access_type}
                onChange={handleChange}
                row
                sx={{ ml: 2 }}
              >
                {accessTypes.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
              </RadioGroup>
            </Box>
          </FormControl>

          {roleName === "STATE_MANAGER" && (
            <>
              <Typography color="primary" variant="subtitle2" sx={{ mt: 2 }}>
                Select states that you want to manage
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>States</InputLabel>
                <Select
                  multiple
                  name="selectedStates"
                  value={formData.selectedStates}
                  onChange={handleChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {roleName === "ZONE_MANAGER" && (
            <>
              <Typography color="primary" variant="subtitle2" sx={{ mt: 2 }}>
                Select zones that you want to manage
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Zones</InputLabel>
                <Select
                  multiple
                  name="selectedZones"
                  value={formData.selectedZones}
                  onChange={handleChange}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {roleName === "DISTRICT_MANAGER" && (
            <>
              <Typography color="primary" variant="subtitle2" sx={{ mt: 2 }}>
                Select districts that you want to manage
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Zones</InputLabel>
                <Select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Districts</InputLabel>
                <Select
                  multiple
                  name="selectedDistricts"
                  value={formData.selectedDistricts}
                  onChange={handleChange}
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {roleName === "BLOCK_MANAGER" && (
            <>
              <Typography color="primary" variant="subtitle2" sx={{ mt: 2 }}>
                Select blocks that you want to manage
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Zones</InputLabel>
                <Select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Districts</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Blocks</InputLabel>
                <Select
                  multiple
                  name="selectedBlocks"
                  value={formData.selectedBlocks}
                  onChange={handleChange}
                >
                  {blocks.map((block) => (
                    <MenuItem key={block.id} value={block.id}>
                      {block.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}

          {(roleName === "TEACHER" || roleName === "STUDENT") && (
            <>
              <Typography color="primary" variant="subtitle2" sx={{ mt: 2 }}>
                Select your school
              </Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>State</InputLabel>
                <Select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  {states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Zones</InputLabel>
                <Select
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                >
                  {zones.map((zone) => (
                    <MenuItem key={zone.id} value={zone.id}>
                      {zone.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Districts</InputLabel>
                <Select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                >
                  {districts.map((district) => (
                    <MenuItem key={district.id} value={district.id}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Blocks</InputLabel>
                <Select
                  name="block"
                  value={formData.block}
                  onChange={handleChange}
                >
                  {blocks.map((block) => (
                    <MenuItem key={block.id} value={block.id}>
                      {block.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>School</InputLabel>
                <Select
                  name="school"
                  value={formData.school}
                  onChange={handleChange}
                >
                  {schools.map((school) => (
                    <MenuItem key={school.id} value={school.id}>
                      {school.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
          {error && (
            <FormHelperText sx={{ color: "indianred", textAlign: "right" }}>
              {error}
            </FormHelperText>
          )}
        </DialogContent>
      ) : (
        <DialogContent>
          {" "}
          <CircularProgress size={24} />
        </DialogContent>
      )}
      <DialogActions>
        <>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            Save
          </Button>
        </>
      </DialogActions>
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </Dialog>
  );
};

AddRoleModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default AddRoleModal;
