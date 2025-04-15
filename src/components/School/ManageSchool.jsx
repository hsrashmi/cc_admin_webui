import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import axios from "axios";
import AddEditClassModal from "./AddEditClassModal";
import ClassCard from "./ClassCard";

const ManageSchool = () => {
  const { id } = useParams();

  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAddClassModal, setOpenAddClassModal] = useState(false);
  // const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const [editingSectionData, setEditingSectionData] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [dataToDelete, setDataToDelete] = useState({});

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchClasses = async () => {
    try {
      const responseClass = await axios.get(
        `http://localhost:8000/ilp/v1/schoolClass/${id}`
      );
      const dataClass = responseClass.data;

      const grouped = {};
      dataClass.forEach((item) => {
        const grade = item.grade;
        const sectionObj = {
          id: item.class_id,
          section: item.section,
          teacher_id: item.class_teacher_id || "",
          teacher_name: item.class_teacher_name || "",
          teacher_assignment_id: item.teacher_assignment_id || "",
          students: item.student_count,
        };

        if (!grouped[grade]) {
          grouped[grade] = [];
        }
        grouped[grade].push(sectionObj);
      });

      const groupedArray = Object.entries(grouped).map(([grade, sections]) => ({
        grade,
        sections,
      }));

      setSchoolClasses(groupedArray);
      setLoading(false);
    } catch (error) {
      setSnackbar({ open: true, message: error, severity: "failure" });
      console.error("Error fetching school classes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [id]);

  const handleAddClass = async (action) => {
    fetchClasses();
    setOpenAddClassModal(false);
    setEditingSectionData(null);
    if (action == "add") showSnackbar("Class added successfully!");
    if (action == "edit") showSnackbar("Class updated successfully!");
  };

  // const handleSubmitAddSection = async (data) => {
  //   try {
  //     await axios.post("http://localhost:8000/ilp/v1/section", {
  //       school_id: id,
  //       grade: currentGradeForSection,
  //       ...data,
  //     });
  //     fetchClasses();
  //   } catch (error) {
  //     console.error("Error adding section:", error);
  //   }
  //   setOpenAddSectionModal(false);
  //   setCurrentGradeForSection("");
  // };

  const handleAddSection = (grade) => {
    setEditingSectionData({ grade: grade });
    setOpenAddClassModal(true);
  };

  const handleEditSection = async (sectionData, grade) => {
    setEditingSectionData({ grade: grade, ...sectionData });
    setOpenAddClassModal(true);
  };

  const confirmDeleteSection = (sectionData) => {
    setDeleteConfirm(true);
    setDataToDelete(sectionData);
    console.log("**************** ", sectionData);
  };

  const handleDeleteSection = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/ilp/v1/schoolClass/${dataToDelete.id}`
      );
      fetchClasses();
      await axios.delete(`http://localhost:8000/ilp/v1/userRoleByField/`, {
        params: {
          field_name: "level_id",
          field_value: dataToDelete.id,
        },
      });
      showSnackbar("Section deleted successfully!");
    } catch (error) {
      setSnackbar({ open: true, message: error, severity: "failure" });
      console.error("Error deleting section:", error);
      showSnackbar("Failed to delete section.", "error");
    }
    setDeleteConfirm(false);
    setDataToDelete({});
  };

  const onUpdateStudents = () => {
    fetchClasses();
  };

  const existingSectionsByGrade = schoolClasses.reduce((acc, cls) => {
    acc[cls.grade] = cls.sections.map((sec) => sec.section);
    return acc;
  }, {});

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage School
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => {
          setOpenAddClassModal(true);
          setEditingSectionData(null);
        }}
        sx={{ mb: 2 }}
      >
        Add Class
      </Button>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : schoolClasses.length === 0 ? (
        <Paper sx={{ p: 2 }}>
          <Typography variant="body1">
            This school is new. Add classes to your school to begin managing.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {schoolClasses.map((cls) => (
            <Grid item size={{ xs: 12, md: 12 }} key={cls.grade}>
              <ClassCard
                classData={cls}
                schoolId={id}
                onAddSection={handleAddSection}
                onEditSection={handleEditSection}
                onDeleteSection={confirmDeleteSection}
                onUpdateStudents={onUpdateStudents}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AddEditClassModal
        open={openAddClassModal}
        onClose={() => setOpenAddClassModal(false)}
        onClassAdded={handleAddClass}
        schoolId={id}
        initialData={editingSectionData ? editingSectionData : {}}
        existingSectionsByGrade={existingSectionsByGrade}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Dialog open={deleteConfirm} onClose={() => setDeleteConfirm(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this section? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(false)}>Cancel</Button>
          <Button onClick={handleDeleteSection} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ManageSchool;
