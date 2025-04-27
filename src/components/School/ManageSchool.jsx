import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import {
  fetchSchoolClasses,
  deleteSchoolClass,
  deleteUserRoleByField,
} from "../../services/SchoolService";
import AddEditClassModal from "./AddEditClassModal";
import ClassCard from "./ClassCard";
import SnackbarUI from "../Utilities/SnackbarUI";
import { useNavigate } from "react-router-dom";

const ManageSchool = () => {
  const { schoolname } = useParams();
  const school = JSON.parse(sessionStorage.getItem("manageSchool"));
  const navigate = useNavigate();
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
    const response = await fetchSchoolClasses(school.id);
    if (response.success) {
      const dataClass = response.data;
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
    } else {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (
      !school ||
      school.name.toLowerCase().replace(/\s+/g, "-") !== schoolname
    ) {
      // fallback: fetch from backend using slug or redirect
      navigate("/schools");
    }
  }, [school]);

  useEffect(() => {
    fetchClasses();
  }, [school.id]);

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
  };

  const handleDeleteSection = async () => {
    const deleteClassResponse = await deleteSchoolClass(dataToDelete.id);
    if (deleteClassResponse.success) {
      const deleteRoleResponse = await deleteUserRoleByField(
        "level_id",
        dataToDelete.id
      );
      if (deleteRoleResponse.success) {
        await fetchClasses();
        showSnackbar("Section deleted successfully!");
      } else {
        showSnackbar(deleteRoleResponse.error, "error");
      }
    } else {
      setSnackbar({
        open: true,
        message: deleteClassResponse.error,
        severity: "error",
      });
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
      <Typography variant="h5" gutterBottom>
        Manage School - {school.name}
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
                schoolId={school.id}
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
        schoolId={school.id}
        initialData={editingSectionData ? editingSectionData : {}}
        existingSectionsByGrade={existingSectionsByGrade}
      />
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
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </Container>
  );
};

export default ManageSchool;
