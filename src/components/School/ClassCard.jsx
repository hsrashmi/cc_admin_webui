import { useState } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PropTypes from "prop-types";
import ManageStudentsModal from "./ManageStudentsModal";
import SnackbarUI from "../Utilities/SnackbarUI";
import {
  fetchClassStudents,
  fetchUnassignedStudents,
  updateSchoolStudents,
  updateClassStudents,
} from "../../services/SchoolService";

const ClassCard = ({
  classData,
  schoolId,
  onAddSection,
  onEditSection,
  onDeleteSection,
  onUpdateStudents,
}) => {
  const { grade, sections } = classData;
  const [openModal, setOpenModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [classStudents, setClassStudents] = useState({});
  const [availableStudents, setAvailableStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const loadStudents = async (section) => {
    const [classStudentsResponse, schoolStudentsResponse] = await Promise.all([
      fetchClassStudents(section),
      fetchUnassignedStudents(schoolId),
    ]);
    if (!classStudentsResponse.success) {
      setSnackbar({
        open: true,
        message: classStudentsResponse.error,
        severity: "error",
      });
      setLoading(false);
      return;
    }
    if (!schoolStudentsResponse.success) {
      setSnackbar({
        open: true,
        message: schoolStudentsResponse.error,
        severity: "error",
      });
      setLoading(false);
      return;
    }
    setClassStudents(classStudentsResponse.data);
    setAvailableStudents(schoolStudentsResponse.data);
    setLoading(false);
  };

  const handleOpenModal = (section) => {
    setSelectedSection(section);
    loadStudents(section.id);
    setOpenModal(true);
  };

  const handleUpdateSchoolStudents = async (updatedStudentIds) => {
    const response = await updateSchoolStudents(schoolId, updatedStudentIds);
    if (!response.success) {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
      return;
    }
    setAvailableStudents(response.data);
  };

  const handleUpdateClassStudents = async (updatedStudentIds) => {
    const response = await updateClassStudents(
      selectedSection.id,
      updatedStudentIds
    );
    if (!response.success) {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
      return;
    }
    setClassStudents(response.data);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6">{grade}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => onAddSection(grade)}
          >
            Add Section
          </Button>
          {sections?.length > 0 ? (
            <Table sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell>Section</TableCell>
                  <TableCell>Teacher</TableCell>
                  <TableCell>No. of Students</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sections.map((sectionData) => (
                  <TableRow key={sectionData.id}>
                    <TableCell>{sectionData.section}</TableCell>
                    <TableCell>{sectionData.teacher_name}</TableCell>
                    <TableCell>{sectionData.students}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => onEditSection(sectionData, grade)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => onDeleteSection(sectionData)}
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color="success"
                        onClick={() => handleOpenModal(sectionData)}
                      >
                        <PersonAddIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography variant="body2" sx={{ mt: 2 }}>
              No sections available. Add sections to manage this school.
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
      {/* Manage Students Modal */}
      {openModal && !loading && (
        <ManageStudentsModal
          open={openModal}
          section={selectedSection.section}
          grade={grade}
          onClose={() => setOpenModal(false)}
          availableStudents={availableStudents}
          assignedStudents={classStudents || []}
          updateSchoolClassStudents={handleUpdateClassStudents}
          updateSchoolStudents={handleUpdateSchoolStudents}
          onUpdateStudents={onUpdateStudents}
        />
      )}
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </>
  );
};

ClassCard.propTypes = {
  classData: PropTypes.shape({
    grade: PropTypes.string.isRequired,
    sections: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        section: PropTypes.string.isRequired,
        teacher_id: PropTypes.string.isRequired,
        teacher_name: PropTypes.string.isRequired,
        teacher_assignment_id: PropTypes.string.isRequired,
        students: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
  schoolId: PropTypes.string.isRequired,
  onAddSection: PropTypes.func.isRequired,
  onEditSection: PropTypes.func.isRequired,
  onDeleteSection: PropTypes.func.isRequired,
  onUpdateStudents: PropTypes.func.isRequired,
};

export default ClassCard;
