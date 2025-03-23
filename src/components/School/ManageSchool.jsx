import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography, Button, Grid, Paper } from "@mui/material";
import axios from "axios";
import AddClassModal from "./AddClassModal";
import AddSectionModal from "./AddSectionModal";
import ClassCard from "./ClassCard";

const ManageSchool = () => {
  const { school_id } = useParams();

  const [schoolClasses, setSchoolClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openAddClassModal, setOpenAddClassModal] = useState(false);
  const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const [openEditSectionModal, setOpenEditSectionModal] = useState(false);

  const [currentGradeForSection, setCurrentGradeForSection] = useState("");
  const [editingSectionData, setEditingSectionData] = useState(null);
  const [editingGrade, setEditingGrade] = useState("");

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/ilp/v1/schoolClass/${school_id}`
      );
      const data = response.data;

      const grouped = {};
      data.forEach((item) => {
        const grade = item.grade;
        const sectionObj = {
          id: `${grade}-${item.section}`,
          section: item.section,
          teacher: item.teacher || "",
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
      console.error("Error fetching school classes:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [school_id]);

  const handleAddClass = async (newData) => {
    try {
      await axios.post("http://localhost:8000/ilp/v1/schoolClass", {
        school_id,
        ...newData,
      });
      fetchClasses();
    } catch (error) {
      console.error("Error adding class:", error);
    }
    setOpenAddClassModal(false);
  };

  const handleSubmitAddSection = async (data) => {
    try {
      await axios.post("http://localhost:8000/ilp/v1/section", {
        school_id,
        grade: currentGradeForSection,
        ...data,
      });
      fetchClasses();
    } catch (error) {
      console.error("Error adding section:", error);
    }
    setOpenAddSectionModal(false);
    setCurrentGradeForSection("");
  };

  const handleSubmitEditSection = async (data) => {
    try {
      await axios.put(
        `http://localhost:8000/ilp/v1/section/${editingSectionData.id}`,
        {
          school_id,
          grade: editingGrade,
          ...data,
        }
      );
      fetchClasses();
    } catch (error) {
      console.error("Error editing section:", error);
    }
    setOpenEditSectionModal(false);
    setEditingSectionData(null);
    setEditingGrade("");
  };

  const handleDeleteSection = async (grade, sectionId) => {
    try {
      await axios.delete(`http://localhost:8000/ilp/v1/section/${sectionId}`);
      fetchClasses();
    } catch (error) {
      console.error("Error deleting section:", error);
    }
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
        onClick={() => setOpenAddClassModal(true)}
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
            <Grid item xs={12} md={6} key={cls.grade}>
              <ClassCard
                classData={cls}
                onAddSection={setCurrentGradeForSection}
                onEditSection={setEditingSectionData}
                onDeleteSection={handleDeleteSection}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <AddClassModal
        open={openAddClassModal}
        onClose={() => setOpenAddClassModal(false)}
        onSubmit={handleAddClass}
        existingSectionsByGrade={existingSectionsByGrade}
      />

      <AddSectionModal
        open={openAddSectionModal}
        onClose={() => setOpenAddSectionModal(false)}
        onSubmit={handleSubmitAddSection}
        existingSections={
          schoolClasses
            .find((c) => c.grade === currentGradeForSection)
            ?.sections.map((sec) => sec.section) || []
        }
      />

      {editingSectionData && (
        <AddSectionModal
          open={openEditSectionModal}
          onClose={() => setOpenEditSectionModal(false)}
          onSubmit={handleSubmitEditSection}
          initialData={editingSectionData}
          existingSections={
            schoolClasses
              .find((c) => c.grade === editingGrade)
              ?.sections.filter((sec) => sec.id !== editingSectionData.id)
              .map((sec) => sec.section) || []
          }
        />
      )}
    </Container>
  );
};

export default ManageSchool;
