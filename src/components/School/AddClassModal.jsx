import { useEffect, useState } from "react";
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

const AddClassModal = ({
  open,
  onClose,
  onClassAdded,
  schoolId,
  existingSectionsByGrade = {},
}) => {
  const allGradeOptions = ["Grade 9", "Grade 10"];
  const allSectionOptions = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [grade, setGrade] = useState("");
  const [section, setSection] = useState("");
  const [teacher, setTeacher] = useState("");
  const [students, setStudents] = useState("");
  const [teachers, setTeachers] = useState([]);

  useEffect(() => {
    if (open) {
      fetchTeachers();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setGrade("");
    setSection("");
    setTeacher("");
    setStudents("");
  };

  const fetchTeachers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/ilp/v1/teachers");
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  };

  const existingSectionsForGrade = grade
    ? existingSectionsByGrade[grade] || []
    : [];
  const availableSectionOptions = allSectionOptions.filter(
    (s) => !existingSectionsForGrade.includes(s)
  );

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8000/ilp/v1/schoolClass", {
        schoolId,
        grade,
        section,
        teacher,
        student_count: Number(students),
      });
      onClassAdded();
      onClose();
    } catch (error) {
      console.error("Error adding class:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Class</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}
        >
          <FormControl fullWidth>
            <InputLabel id="grade-label">Grade</InputLabel>
            <Select
              labelId="grade-label"
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                setSection("");
              }}
            >
              {allGradeOptions.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={!grade}>
            <InputLabel id="section-label">Section</InputLabel>
            <Select
              labelId="section-label"
              value={section}
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
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!grade || !section || !teacher || !students}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddClassModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClassAdded: PropTypes.func.isRequired,
  schoolId: PropTypes.string.isRequired,
  existingSectionsByGrade: PropTypes.object,
};

export default AddClassModal;
