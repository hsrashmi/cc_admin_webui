import {
  Modal,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Paper,
} from "@mui/material";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const ManageStudentsModal = ({
  open,
  onClose,
  availableStudents,
  assignedStudents,
  updateSchoolClassStudents,
  updateSchoolStudents,
  onUpdateStudents,
}) => {
  const [assigned, setAssigned] = useState([]);
  const [available, setAvailable] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);

  // Store the initial state to track changes
  const [initialAssigned, setInitialAssigned] = useState([]);
  // const [initialAvailable, setInitialAvailable] = useState([]);

  useEffect(() => {
    setAssigned(assignedStudents);
    setAvailable(availableStudents);
    setInitialAssigned(assignedStudents);
    // setInitialAvailable(availableStudents);
  }, [assignedStudents, availableStudents]);

  const toggleAvailableSelection = (student) => {
    setSelectedAvailable((prev) =>
      prev.includes(student)
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student]
    );
  };

  const toggleAssignedSelection = (student) => {
    setSelectedAssigned((prev) =>
      prev.includes(student)
        ? prev.filter((s) => s.id !== student.id)
        : [...prev, student]
    );
  };

  const moveToAssigned = () => {
    setAssigned([...assigned, ...selectedAvailable]);
    setAvailable(available.filter((s) => !selectedAvailable.includes(s)));
    setSelectedAvailable([]);
  };

  const moveToAvailable = () => {
    setAvailable([...available, ...selectedAssigned]);
    setAssigned(assigned.filter((s) => !selectedAssigned.includes(s)));
    setSelectedAssigned([]);
  };

  const handleSave = async () => {
    const newlyAssigned = assigned
      .filter((s) => !initialAssigned.some((orig) => orig.id === s.id))
      .map((s) => s.id);
    const removedFromAssigned = initialAssigned
      .filter((s) => !assigned.some((curr) => curr.id === s.id))
      .map((s) => s.id);

    try {
      if (newlyAssigned.length) {
        await updateSchoolClassStudents(newlyAssigned);
      }
      if (removedFromAssigned.length) {
        await updateSchoolStudents(removedFromAssigned);
      }
      onUpdateStudents();
      onClose();
    } catch (error) {
      console.error("Error updating students:", error);
    }
  };

  return (
    <Modal open={open.toString()} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 3,
          borderRadius: 2,
          minWidth: 600,
        }}
      >
        <Typography variant="h5" sx={{ mb: 2 }}>
          Manage Students in Section
        </Typography>

        <Grid container spacing={2}>
          {/* Available Students */}
          <Grid item size={{ xs: 5 }}>
            <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
              <Box sx={{ bgcolor: "lightgrey", p: 1, borderRadius: 1 }}>
                <Typography variant="subtitle1">Assigned Students</Typography>
              </Box>
              <List>
                {assigned.map((student) => (
                  <ListItem
                    key={student.id}
                    button
                    onClick={() => toggleAssignedSelection(student)}
                    selected={selectedAssigned.includes(student)}
                    sx={{
                      bgcolor: selectedAssigned.includes(student)
                        ? "secondary.main"
                        : "transparent",
                      "&:hover": { bgcolor: "secondary.main" },
                    }}
                  >
                    <ListItemText
                      primary={student.first_name + " " + student.last_name}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          {/* Move Buttons */}
          <Grid
            item
            xs={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              onClick={moveToAvailable}
              disabled={!selectedAssigned.length}
            >
              {">>"}
            </Button>
            <Button
              variant="contained"
              onClick={moveToAssigned}
              disabled={!selectedAvailable.length}
            >
              {"<<"}
            </Button>
          </Grid>

          {/* Assigned Students */}
          <Grid item size={{ xs: 5 }}>
            <Paper sx={{ p: 2, maxHeight: 300, overflow: "auto" }}>
              <Box sx={{ bgcolor: "lightgrey", p: 1, borderRadius: 1 }}>
                <Typography variant="subtitle1">Available Students</Typography>
              </Box>
              <List>
                {available.map((student) => (
                  <ListItem
                    key={student.id}
                    button
                    onClick={() => toggleAvailableSelection(student)}
                    selected={selectedAvailable.includes(student)}
                    sx={{
                      bgcolor: selectedAvailable.includes(student)
                        ? "secondary.main"
                        : "transparent",
                      "&:hover": { bgcolor: "secondary.main" },
                    }}
                  >
                    <ListItemText
                      primary={student.first_name + " " + student.last_name}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Save & Cancel */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
          <Button onClick={onClose} sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save Changes
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ManageStudentsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  availableStudents: PropTypes.array.isRequired,
  assignedStudents: PropTypes.array.isRequired,
  updateSchoolClassStudents: PropTypes.func.isRequired,
  updateSchoolStudents: PropTypes.func.isRequired,
  onUpdateStudents: PropTypes.func.isRequired,
};

export default ManageStudentsModal;
