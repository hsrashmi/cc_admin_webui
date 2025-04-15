import { useEffect, useState } from "react";
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
} from "@mui/material";
import PropTypes from "prop-types";
import {
  fetchTeachers,
  saveClass,
  updateClass,
} from "../../services/SchoolService";
import SnackbarUI from "../Utilities/SnackbarUI";

const AddClassModal = ({
  open,
  onClose,
  onClassAdded,
  schoolId,
  initialData,
  existingSectionsByGrade = {},
}) => {
  console.log("initialData", initialData);
  const allGradeOptions = ["Grade 9", "Grade 10"];
  const allSectionOptions = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(65 + i)
  );

  const [grade, setGrade] = useState(initialData.grade || "");
  const [section, setSection] = useState(initialData.section || "");
  const [teacher, setTeacher] = useState(initialData.teacher_id || "");
  const [teachers, setTeachers] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchTeachersData = async () => {
    const response = await fetchTeachers(schoolId);
    if (!response.success) {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
      return;
    }
    setTeachers(response.data);
  };

  useEffect(() => {
    if (open) {
      fetchTeachersData();
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setGrade(initialData.grade || "");
    setSection(initialData.section || "");
    setTeacher(initialData.teacher_id || "");
  };

  const handleSubmit = async () => {
    const classData = {
      id: initialData.id,
      schoolId: schoolId,
      grade: grade,
      section: section,
      teacher: teacher,
      teacher_assignment_id: initialData.teacher_assignment_id,
    };
    const saveResponse = initialData.id
      ? await updateClass(classData)
      : await saveClass(classData);

    if (!saveResponse.success) {
      setSnackbar({
        open: true,
        message: saveResponse.error,
        severity: "error",
      });
      return;
    }
    onClassAdded(saveResponse.data.type);
    onClose();
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {initialData.id ? "Edit Class" : "Add New Class"}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "200px",
              gap: 2,
              mt: 2,
            }}
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
                disabled={!!initialData.grade} // Disable if grade is provided
              >
                {allGradeOptions.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel id="section-label">Section</InputLabel>
              <Select
                labelId="section-label"
                value={section}
                onChange={(e) => setSection(e.target.value)}
              >
                {allSectionOptions.map((s) => (
                  <MenuItem
                    key={s}
                    value={s}
                    disabled={
                      existingSectionsByGrade[grade]?.includes(s) &&
                      s !== initialData.section
                    }
                  >
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
                  <MenuItem key={t.id} value={t.id}>
                    {t.first_name + " " + t.last_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={!grade || !section || !teacher}
          >
            {initialData.id ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
};

AddClassModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onClassAdded: PropTypes.func.isRequired,
  schoolId: PropTypes.string.isRequired,
  existingSectionsByGrade: PropTypes.object,
  initialData: PropTypes.object.isRequired,
};

export default AddClassModal;
