import { useState, useEffect } from "react";
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
import { fetchTeachers, createSection } from "../../services/SchoolService";
import SnackbarUI from "../Utilities/SnackbarUI";

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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    const loadTeachers = async () => {
      if (open) {
        const response = await fetchTeachers(schoolId);
        if (response.success) {
          setTeachers(response.data);
        } else {
          setSnackbar({
            open: true,
            message: response.error,
            severity: "error",
          });
        }
      }
    };
    loadTeachers();
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
    const response = await createSection({
      schoolId,
      section,
      teacher,
      students: Number(students),
    });

    if (response.success) {
      fetchSections(); // Refresh section list
      onClose(); // Close the modal
      setSection("");
      setTeacher("");
      setStudents("");
    } else {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
    }
  };

  return (
    <>
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
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
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
