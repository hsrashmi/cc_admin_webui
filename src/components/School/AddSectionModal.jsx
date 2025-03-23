import { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import PropTypes from "prop-types";

const AddSectionModal = ({
  open,
  onClose,
  schoolId,
  fetchSections,
  existingSections = [],
}) => {
  const [section, setSection] = useState("");
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/ilp/v1/teachers"
        );
        setTeachers(response.data);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    if (open) fetchTeachers();
  }, [open]);

  // Create an array for A–Z.
  const allSectionOptions = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  // Exclude sections that are already added.
  const availableSectionOptions = allSectionOptions.filter(
    (s) => !existingSections.includes(s)
  );

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/ilp/v1/sections", {
        schoolId,
        section,
        teacher,
        students: Number(students),
      });
      fetchSections(); // Refresh section list
      onClose(); // Close the modal
      setSection("");
      setTeacher("");
      setStudents("");
    } catch (error) {
      console.error("Error adding section:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Section</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <FormControl fullWidth>
            <InputLabel id="section-label">Section</InputLabel>
            <Select
              labelId="section-label"
              value={section}
              label="Section"
              onChange={(e) => setSection(e.target.value)}
            >
              {availableSectionOptions.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="teacher-label">Teacher</InputLabel>
            <Select
              labelId="teacher-label"
              value={teacher}
              label="Teacher"
              onChange={(e) => setTeacher(e.target.value)}
            >
              {teachers.map((t) => (
                <MenuItem key={t.id} value={t.name}>
                  {t.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="No. of Students"
            type="number"
            value={students}
            onChange={(e) => setStudents(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddSectionModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  schoolId: PropTypes.string.isRequired,
  fetchSections: PropTypes.func.isRequired,
  existingSections: PropTypes.arrayOf(PropTypes.string),
};

export default AddSectionModal;
