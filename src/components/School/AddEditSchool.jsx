import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useParams } from "react-router-dom";
import SnackbarUI from "../Utilities/SnackbarUI";
import * as SchoolService from "../../services/SchoolService";

const AddEditSchoolPage = () => {
  const { schoolname } = useParams();
  const school = JSON.parse(sessionStorage.getItem("editSchool"));
  const mode = schoolname ? "edit" : "add";

  const [schoolData, setSchoolData] = useState({
    name: "",
    long_name: "",
    dise_code: 0,
    organization_name: "",
    organization_id: "",
    address: "",
    city: "",
    pincode: 0,
    state_name: "",
    state_id: "",
    zone_name: "",
    zone_id: "",
    district_name: "",
    district_id: "",
    block_name: "",
    block_id: "",
  });
  const [originalSchoolData, setOriginalSchoolData] = useState({});
  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    fetchStates();
    fetchOrgs();
    if (mode === "edit" && schoolname) fetchSchoolData();
  }, [mode, schoolname]);

  const fetchStates = async () => {
    const response = await SchoolService.fetchStates();
    if (response.success) {
      setStates(response.data);
    } else {
      setSnackbar({ open: true, message: response.error, severity: "error" });
    }
  };

  const fetchOrgs = async () => {
    const response = await SchoolService.fetchOrganizations();
    if (response.success) {
      setOrganizations(response.data);
    } else {
      setSnackbar({ open: true, message: response.error, severity: "error" });
    }
  };

  const fetchSchoolData = async () => {
    const response = await SchoolService.fetchSchoolById(school.id);
    if (response.success) {
      setSchoolData(response.data);
      setOriginalSchoolData(response.data);
      fetchZones(response.data.state_id);
      fetchDistricts(response.data.zone_id);
      fetchBlocks(response.data.district_id);
    } else {
      setSnackbar({ open: true, message: response.error, severity: "error" });
    }
  };

  const fetchZones = async (state) => {
    const response = await SchoolService.fetchZonesByState(state);
    if (response.success) {
      setZones(response.data);
    } else {
      setSnackbar({ open: true, message: response.error, severity: "error" });
    }
  };

  const fetchDistricts = async (zone) => {
    const response = await SchoolService.fetchDistrictsByZone(zone);
    if (response.success) {
      setDistricts(response.data);
    } else {
      setSnackbar({ open: true, message: response.error, severity: "error" });
    }
  };

  const fetchBlocks = async (district) => {
    const response = await SchoolService.fetchBlocksByDistrict(district);
    if (response.success) {
      setBlocks(response.data);
    } else {
      setSnackbar({ open: true, message: response.error, severity: "error" });
    }
  };

  const resetAllValues = () => {
    if (mode === "edit") setSchoolData(originalSchoolData);
    else
      setSchoolData({
        name: "",
        long_name: "",
        dise_code: 0,
        organization_name: "",
        organization_id: "",
        address: "",
        city: "",
        pincode: 0,
        state_name: "",
        state_id: "",
        zone_name: "",
        zone_id: "",
        district_name: "",
        district_id: "",
        block_name: "",
        block_id: "",
      });
    setZones([]);
    setDistricts([]);
    setBlocks([]);
  };

  const convertSchoolData = () => {
    return {
      name: schoolData.name,
      long_name: schoolData.long_name,
      dise_code: schoolData.dise_code,
      organization_id: schoolData.organization_id,
      address: schoolData.address,
      city: schoolData.city,
      pincode: schoolData.pincode,
      block_id: schoolData.block_id,
      state: schoolData.state_name,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "organization_id") {
      setSchoolData((prev) => ({
        ...prev,
        organization_id: value,
        organization_name: value,
      }));
    } else if (name === "state_id") {
      fetchZones(value);
      setSchoolData((prev) => ({
        ...prev,
        state_id: value,
        state_name: value,
        zone_name: "",
        zone_id: "",
        district_name: "",
        district_id: "",
        block_name: "",
      }));
      setZones([]);
      setDistricts([]);
      setBlocks([]);
    } else if (name === "zone_id") {
      fetchDistricts(value);
      setSchoolData((prev) => ({
        ...prev,
        zone_id: value,
        zone_name: value,
        district_name: "",
        district_id: "",
        block_name: "",
        block_id: "",
      }));
      setDistricts([]);
      setBlocks([]);
    } else if (name === "district_id") {
      fetchBlocks(value);
      setSchoolData((prev) => ({
        ...prev,
        district_id: value,
        district_name: value,
        block_name: "",
        block_id: "",
      }));
      setBlocks([]);
    } else if (name === "block_id") {
      setSchoolData((prev) => ({
        ...prev,
        block_id: value,
        block_name: value,
      }));
    } else {
      setSchoolData({ ...schoolData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actualSchoolData = convertSchoolData();

    const response =
      mode === "add"
        ? await SchoolService.createSchool(actualSchoolData)
        : await SchoolService.updateSchool(school.id, actualSchoolData);

    if (response.success) {
      setSnackbar({
        open: true,
        message: `School ${
          mode === "add" ? "created" : "updated"
        } successfully`,
        severity: "success",
      });
    } else {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h5" gutterBottom>
        {mode === "edit" ? `Edit School - ${school.name}` : "Add New School"}
      </Typography>
      <Paper sx={{ padding: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="School Name"
            name="name"
            value={schoolData.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Long Name"
            name="long_name"
            value={schoolData.long_name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Dise Code"
            name="dise_code"
            value={schoolData.dise_code}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Organization</InputLabel>
            <Select
              name="organization_id"
              value={schoolData.organization_name}
              onChange={handleChange}
              required
              disabled={!organizations.length}
            >
              {organizations.map((organization) => (
                <MenuItem key={organization.id} value={organization.id}>
                  {organization.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={schoolData.address}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="City"
            name="city"
            value={schoolData.city}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={schoolData.pincode}
            onChange={handleChange}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>State</InputLabel>
            <Select
              name="state_id"
              value={schoolData.state_id}
              onChange={handleChange}
              required
            >
              {states.map((state) => (
                <MenuItem key={state.id} value={state.id}>
                  {state.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Zone</InputLabel>
            <Select
              name="zone_id"
              value={schoolData.zone_id}
              onChange={handleChange}
              required
              disabled={!zones.length}
            >
              {zones.map((zone) => (
                <MenuItem key={zone.id} value={zone.id}>
                  {zone.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>District</InputLabel>
            <Select
              name="district_id"
              value={schoolData.district_id}
              onChange={handleChange}
              required
              disabled={!districts.length}
            >
              {districts.map((district) => (
                <MenuItem key={district.id} value={district.id}>
                  {district.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Block</InputLabel>
            <Select
              name="block_id"
              value={schoolData.block_id}
              onChange={handleChange}
              required
              disabled={!blocks.length}
            >
              {blocks.map((block) => (
                <MenuItem key={block.id} value={block.id}>
                  {block.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
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
            <Grid size={{ xs: 12, md: 6 }}>
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
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </Container>
  );
};

export default AddEditSchoolPage;
