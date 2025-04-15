// AddRegionDialog.jsx
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const AddRegionDialog = ({
  open,
  level,
  handleClose,
  parentName,
  parentId,
  handleEditRegion,
  handleAddRegion,
  editData,
}) => {
  const isEdit = Boolean(editData);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (editData) {
      setName(editData.name || "");
      setDescription(editData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [editData, open]);

  const handleSubmit = () => {
    if (isEdit) {
      handleEditRegion(level, editData.id, name, description);
    } else {
      handleAddRegion(level, parentId, name, description);
    }
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{isEdit ? `Edit ${level}` : `Add ${level}`}</DialogTitle>
      <DialogContent className="space-y-4 pt-4">
        <Typography variant="subtitle2" gutterBottom>
          Level: {parentName}
        </Typography>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          fullWidth
          multiline
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isEdit ? "Save" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AddRegionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  level: PropTypes.string.isRequired,
  parentName: PropTypes.string.isRequired,
  parentId: PropTypes.string.isRequired,
  handleEditRegion: PropTypes.func.isRequired,
  handleAddRegion: PropTypes.func.isRequired,
  editData: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
  }),
};

export default AddRegionDialog;
