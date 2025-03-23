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
import axios from "axios";

const AddSchoolPage = () => {
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

  const [states, setStates] = useState([]);
  const [zones, setZones] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [organizations, setOrganizations] = useState([]);

  useEffect(() => {
    fetchStates();
    fetchOrgs();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get("http://localhost:8000/ilp/v1/state");
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchOrgs = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/ilp/v1/organization"
      );
      setOrganizations(response.data);
    } catch (error) {
      console.error("Error fetching organizations:", error);
    }
  };

  const fetchZones = async (state) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/ilp/v1/getZonesByParams",
        {
          filters: { state_id: { "==": state } },
        }
      );
      setZones(response.data);
    } catch (error) {
      console.error("Error fetching zones:", error);
    }
  };

  const fetchDistricts = async (zone) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/ilp/v1/getDistrictsByParams",
        {
          filters: { zone_id: { "==": zone } },
        }
      );
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchBlocks = async (district) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/ilp/v1/getBlocksByParams",
        {
          filters: { district_id: { "==": district } },
        }
      );
      setBlocks(response.data);
    } catch (error) {
      console.error("Error fetching blocks:", error);
    }
  };

  const convertSchoolData = () => {
    console.log("schooldata ", schoolData);
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
    console.log(name, value);

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
    console.log(schoolData);
  };

  const handleSubmit = async (e) => {
    const actualSchoolData = convertSchoolData();
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/ilp/v1/school", actualSchoolData);
    } catch (error) {
      console.error("Error adding school:", error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        Add New School
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
              value={schoolData.state_name}
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
              value={schoolData.zone_name}
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
              value={schoolData.district_name}
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
              value={schoolData.block_name}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
          >
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddSchoolPage;
