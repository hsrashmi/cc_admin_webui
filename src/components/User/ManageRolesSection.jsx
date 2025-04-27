import { useState, useEffect } from "react";
import {
  Button,
  IconButton,
  Box,
  Typography,
  Paper,
  Tooltip,
} from "@mui/material";
import PropTypes from "prop-types";
import DeleteIcon from "@mui/icons-material/Delete";
import AddRoleModal from "./AddRoleModal";
import { EditOffTwoTone, EditTwoTone } from "@mui/icons-material";
import {
  fetchUserRoles,
  deleteUserRole,
  createUserRoles,
} from "../../services/UserService";
import SnackbarUI from "../Utilities/SnackbarUI";

const ManageRoles = ({ originalRoles, userId }) => {
  const [roles, setRoles] = useState(originalRoles);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupedRoles, setGroupedRoles] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  useEffect(() => {
    const groupedData = groupRolesByLevel();
    console.log("groupedData ------- ", groupedData);
    setGroupedRoles(groupedData);
  }, [roles]);

  const fetcRoles = async () => {
    const response = await fetchUserRoles(userId);
    if (response.success) {
      setRoles(response.data);
    } else {
      setSnackbar({
        open: true,
        message: response.error,
        severity: "error",
      });
    }
  };

  function groupRolesByLevel() {
    const grouped = {};
    if (roles) {
      roles.forEach((role) => {
        const levelKey = role.level;
        const levelIdKey = role.level === "ROOT" ? "ROOT" : role.level_id;

        if (!grouped[levelKey]) {
          grouped[levelKey] = {};
        }

        if (!grouped[levelKey][levelIdKey]) {
          grouped[levelKey][levelIdKey] = role;
          grouped[levelKey][levelIdKey].name =
            role.level === "ROOT"
              ? "ROOT"
              : role[`${role.level.toLowerCase()}_name`];
        }
      });
    }
    return grouped;
  }

  const handleDelete = async (roleData) => {
    const response = await deleteUserRole(roleData.id);
    if (response.success) {
      fetcRoles();
    }
  };

  const handleAddRole = async (roleData) => {
    const response = await createUserRoles(roleData);
    if (response.success) {
      fetcRoles();
    }
  };

  return (
    <Box>
      <Box
        sx={{
          borderTop: "1px solid lightgrey",
          mt: 2,
          pt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" mb={2}>
          Manage Roles
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsModalOpen(true)}
          sx={{ mb: 2 }}
        >
          Add Role
        </Button>
      </Box>
      <Box
        display="grid"
        gap={4}
        gridTemplateColumns={{
          xs: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
      >
        {Object.entries(groupedRoles).map(([level, entities]) =>
          Object.values(entities).map((entity) => (
            <Box key={entity.level_id} sx={{ mb: 4 }}>
              <Paper
                key={entity.id}
                sx={{
                  p: 1,
                  mb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h5" color="primary" gutterBottom>
                    {entity.role_name}
                    {entity.access_type === "READ" ? (
                      <Tooltip title="Read-only access">
                        <EditOffTwoTone sx={{ color: "grey", mt: -1, ml: 1 }} />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Write access">
                        <EditTwoTone sx={{ color: "grey", mt: -1, ml: 1 }} />
                      </Tooltip>
                    )}
                  </Typography>
                  <Tooltip
                    title={entity.name.length > 20 ? entity.name : ""}
                    arrow
                  >
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entity.name}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box display="flex">
                  <Tooltip title="Delete role assignemnt">
                    <IconButton
                      onClick={() => handleDelete(entity)}
                      color="primary"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Box>
          ))
        )}
      </Box>
      {isModalOpen && (
        <AddRoleModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddRole}
          userId={userId}
        />
      )}
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </Box>
  );
};

ManageRoles.propTypes = {
  originalRoles: PropTypes.array.isRequired,
  userId: PropTypes.string.isRequired,
};
export default ManageRoles;
