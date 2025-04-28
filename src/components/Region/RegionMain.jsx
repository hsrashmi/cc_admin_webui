import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Grid,
  Collapse,
  CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  School as SchoolIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
  EditOffTwoTone,
  EditTwoTone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SnackbarUI from "../Utilities/SnackbarUI";
import AddRegionDialog from "./AddRegion";
import {
  fetchRegions,
  fetchResponsibleUsers,
  fetchDistricts,
  fetchBlocks,
  deleteRegion,
  addRegion,
  updateRegion,
} from "../../services/RegionService";

export default function RegionManagement() {
  const [regions, setRegions] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
    level: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(() => {
    const initialState = {};
    regions.forEach((state) => {
      initialState[state.id] = true; // State level expanded
      state.zones.forEach((zone) => {
        initialState[zone.id] = true; // Zone level expanded
      });
    });
    return initialState;
  });
  const [editDialog, setEditDialog] = useState({
    open: false,
    level: "",
    region: null,
    parentName: "",
    parentId: null,
  });
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [responsibleUsers, setResponsibleUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    const loadRegions = async () => {
      setIsLoading(true);
      const regionResponse = await fetchRegions();
      if (!regionResponse.success) {
        setSnackbar({
          open: true,
          message: regionResponse.error,
          severity: "error",
        });
        setIsLoading(false);
        return;
      }
      const regions = regionResponse.data;
      setRegions(regions);

      if (regions.length > 0) {
        const firstState = regions[0];
        setSelectedRegion({
          level: "state",
          id: firstState.id,
          name: firstState.name,
        });
        loadResponsibleUsers("state", firstState.id);
      }
      setIsLoading(false);
    };
    loadRegions();
  }, []);

  const loadResponsibleUsers = async (level, id) => {
    setIsUsersLoading(true);

    const users = await fetchResponsibleUsers(level, id);
    if (!users.success) {
      setSnackbar({
        open: true,
        message: users.error,
        severity: "error",
      });
      setIsUsersLoading(false);
      return;
    }
    setResponsibleUsers(users.data);
    setIsUsersLoading(false);
  };

  const loadDistricts = async (zoneId) => {
    const districtResponse = await fetchDistricts(zoneId);
    if (!districtResponse.success) {
      setSnackbar({
        open: true,
        message: districts.error,
        severity: "error",
      });
      return;
    }
    const { data: districts } = districtResponse;
    setRegions((prev) =>
      prev.map((state) => ({
        ...state,
        zones: state.zones.map((zone) =>
          zone.id === zoneId ? { ...zone, districts } : zone
        ),
      }))
    );
  };

  const loadBlocks = async (districtId) => {
    const blockResponse = await fetchBlocks(districtId);
    if (!blockResponse.success) {
      setSnackbar({
        open: true,
        message: blockResponse.error,
        severity: "error",
      });
      return;
    }
    const { data: blocks } = blockResponse;
    setRegions((prev) =>
      prev.map((state) => ({
        ...state,
        zones: state.zones.map((zone) => ({
          ...zone,
          districts: zone.districts?.map((d) =>
            d.id === districtId ? { ...d, blocks: blocks } : d
          ),
        })),
      }))
    );
  };

  const toggleExpand = async (id, level) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

    if (!expanded[id]) {
      if (level === "zone") {
        const zone = regions.flatMap((s) => s.zones).find((z) => z.id === id);
        if (!zone.districts) await loadDistricts(id);
      } else if (level === "district") {
        const district = regions
          .flatMap((s) => s.zones)
          .flatMap((z) => z.districts || [])
          .find((d) => d.id === id);
        if (!district.blocks) await loadBlocks(id);
      }
    }
  };

  const handleViewSchools = (filterBy, filterValue) => {
    navigate(`/schools?filterby=${filterBy}&filtervalue=${filterValue}`);
  };

  const handleConfirmDelete = (id, level) => {
    setConfirmDelete({ open: true, id, level });
  };

  const handleRegionClick = (level, region) => {
    setSelectedRegion({ level, id: region.id, name: region.name });
    loadResponsibleUsers(level, region.id);
  };

  const handleDelete = async () => {
    const deleteRegionRes = await deleteRegion(
      confirmDelete.level,
      confirmDelete.id
    );
    if (!deleteRegionRes.success) {
      setSnackbar({
        open: true,
        message: deleteRegionRes.error,
        severity: "error",
      });
      return;
    }
    setRegions((prevRegions) => {
      const { level, id } = confirmDelete;

      const updateRegions = (regions) => {
        return regions
          .map((state) => {
            if (level === "state" && state.id === id) {
              return null;
            }

            const updatedZones = state.zones
              ?.map((zone) => {
                if (level === "zone" && zone.id === id) return null;

                const updatedDistricts = zone.districts
                  ?.map((district) => {
                    if (level === "district" && district.id === id) return null;

                    const updatedBlocks = district.blocks?.filter(
                      (block) => !(level === "block" && block.id === id)
                    );

                    return {
                      ...district,
                      blocks: updatedBlocks,
                    };
                  })
                  .filter(Boolean);

                return {
                  ...zone,
                  districts: updatedDistricts,
                };
              })
              .filter(Boolean);

            return {
              ...state,
              zones: updatedZones,
            };
          })
          .filter(Boolean);
      };

      return updateRegions(prevRegions);
    });

    setConfirmDelete({ open: false, id: null, level: "" });

    setSnackbar({
      open: true,
      message: "Region deleted successfully!",
      severity: "success",
    });
  };

  const handleAddRegion = async (level, parentId, name, description) => {
    const newRegionResponse = await addRegion(level.toLowerCase(), {
      name,
      description,
      [`${getParentKey(level)}`]: parentId,
    });
    if (!newRegionResponse.success) {
      setSnackbar({
        open: true,
        message: newRegionResponse.error,
        severity: "error",
      });
      return;
    }
    setRegions((prev) =>
      updateRegionState(prev, level, newRegionResponse.data)
    );
    setSnackbar({
      open: true,
      message: `${level} added successfully!`,
      severity: "success",
    });
  };

  const handleEditRegion = async (level, id, name, description) => {
    const updateRegionRes = await updateRegion(level.toLowerCase(), id, {
      name,
      description,
    });
    if (!updateRegionRes.success) {
      setSnackbar({
        open: true,
        message: updateRegionRes.error,
        severity: "error",
      });
      return;
    }
    setRegions((prev) =>
      updateRegionState(prev, level, { ...{ name, description }, id: id }, true)
    );
    setSnackbar({
      open: true,
      message: `${level} updated successfully!`,
      severity: "success",
    });
  };

  const updateRegionState = (regions, level, regionData, isEdit = false) => {
    switch (level) {
      case "state":
        if (isEdit) {
          return regions.map((s) =>
            s.id === regionData.id ? { ...s, ...regionData } : s
          );
        }
        return [...regions, { ...regionData, zones: [] }];

      case "zone":
        return regions.map((state) => {
          if (state.id !== regionData.state_id) return state;

          const updatedZones = isEdit
            ? state.zones.map((z) =>
                z.id === regionData.id ? { ...z, ...regionData } : z
              )
            : [...state.zones, { ...regionData, districts: [] }];

          return { ...state, zones: updatedZones };
        });

      case "district":
        return regions.map((state) => ({
          ...state,
          zones: state.zones.map((zone) => {
            if (zone.id !== regionData.zone_id) return zone;

            const updatedDistricts = isEdit
              ? zone.districts?.map((d) =>
                  d.id === regionData.id ? { ...d, ...regionData } : d
                )
              : [...(zone.districts || []), { ...regionData, blocks: [] }];

            return { ...zone, districts: updatedDistricts };
          }),
        }));

      case "block":
        return regions.map((state) => ({
          ...state,
          zones: state.zones.map((zone) => ({
            ...zone,
            districts: zone.districts?.map((district) => {
              if (district.id !== regionData.district_id) return district;

              const updatedBlocks = isEdit
                ? district.blocks?.map((b) =>
                    b.id === regionData.id ? { ...b, ...regionData } : b
                  )
                : [...(district.blocks || []), regionData];

              return { ...district, blocks: updatedBlocks };
            }),
          })),
        }));

      default:
        return regions;
    }
  };

  const getParentKey = (level) => {
    switch (level) {
      case "zone":
        return "state_id";
      case "district":
        return "zone_id";
      case "block":
        return "district_id";
      default:
        return null;
    }
  };

  return (
    <Box p={6}>
      <Typography variant="h4" gutterBottom>
        Region Management
      </Typography>
      {isLoading ? (
        <Box display="flex" justifyContent="center" my={3}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={2}>
            <Grid item size={{ xs: 12, md: 6 }}>
              {regions.map((state) => (
                <Card key={state.id}>
                  <CardContent width="100%">
                    {/* State Level */}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        borderRadius: 1,
                        cursor: "pointer",
                        backgroundColor:
                          selectedRegion?.level === "state" &&
                          selectedRegion?.id === state.id
                            ? "secondary.main"
                            : "transparent",
                        "&:hover": {
                          backgroundColor: "#f1f1f1",
                        },
                      }}
                      onClick={() => handleRegionClick("state", state)}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(state.id, "state");
                          }}
                        >
                          <ExpandMoreIcon
                            style={{
                              transform: expanded[state.id]
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </IconButton>
                        <Typography variant="h6">{state.name}</Typography>
                      </Box>
                      <Box>
                        <Tooltip title={`Add a zone under ${state.name}`}>
                          <IconButton
                            color="success"
                            onClick={() =>
                              setEditDialog({
                                open: true,
                                level: "Zone",
                                region: null,
                                parentId: state.id,
                                parentName: state.name,
                              })
                            }
                          >
                            <AddIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Edit ${state.name}`}>
                          <IconButton
                            color="warning"
                            onClick={() =>
                              setEditDialog({
                                open: true,
                                level: "State",
                                region: state,
                                parentId: state.id,
                                parentName: state.name,
                              })
                            }
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`View schools of ${state.name}`}>
                          <IconButton
                            color="primary"
                            onClick={() =>
                              handleViewSchools("state", state.name)
                            }
                          >
                            <SchoolIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={`Delete ${state.name}`}>
                          <IconButton
                            color="error"
                            onClick={() =>
                              handleConfirmDelete(state.id, "state")
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Collapse in={expanded[state.id]}>
                      {state.zones.map((zone) => (
                        <Box ml={4} mt={2} key={zone.id}>
                          {/* Zone Level */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              borderRadius: 1,
                              cursor: "pointer",
                              backgroundColor:
                                selectedRegion?.level === "zone" &&
                                selectedRegion?.id === zone.id
                                  ? "secondary.main"
                                  : "transparent",
                              "&:hover": {
                                backgroundColor: "#f1f1f1",
                              },
                            }}
                            onClick={() => handleRegionClick("zone", zone)}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <IconButton
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpand(zone.id, "zone");
                                }}
                              >
                                <ExpandMoreIcon
                                  style={{
                                    transform: expanded[zone.id]
                                      ? "rotate(180deg)"
                                      : "rotate(0deg)",
                                  }}
                                />
                              </IconButton>
                              <Typography variant="subtitle1">
                                {zone.name}
                              </Typography>
                            </Box>
                            <Box>
                              <Tooltip
                                title={`Add a district under ${zone.name}`}
                              >
                                <IconButton
                                  color="success"
                                  onClick={() =>
                                    setEditDialog({
                                      open: true,
                                      level: "District",
                                      region: null,
                                      parentId: zone.id,
                                      parentName: zone.name,
                                    })
                                  }
                                >
                                  <AddIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={`Edit ${zone.name}`}>
                                <IconButton
                                  color="warning"
                                  onClick={() =>
                                    setEditDialog({
                                      open: true,
                                      level: "Zone",
                                      region: zone,
                                      parentId: zone.id,
                                      parentName: zone.name,
                                    })
                                  }
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={`View schools of ${zone.name}`}>
                                <IconButton
                                  color="primary"
                                  onClick={() =>
                                    handleViewSchools("zone", zone.name)
                                  }
                                >
                                  <SchoolIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title={`Delete ${zone.name}`}>
                                <IconButton
                                  color="error"
                                  onClick={() =>
                                    handleConfirmDelete(zone.id, "zone")
                                  }
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </Box>

                          <Collapse in={expanded[zone.id]}>
                            {zone.districts?.map((district) => (
                              <Box ml={6} mt={1} key={district.id}>
                                {/* District Level */}
                                <Box
                                  display="flex"
                                  justifyContent="space-between"
                                  alignItems="center"
                                  sx={{
                                    borderRadius: 1,
                                    cursor: "pointer",
                                    backgroundColor:
                                      selectedRegion?.level === "district" &&
                                      selectedRegion?.id === district.id
                                        ? "secondary.main"
                                        : "transparent",
                                    "&:hover": {
                                      backgroundColor: "#f1f1f1",
                                    },
                                  }}
                                  onClick={() =>
                                    handleRegionClick("district", district)
                                  }
                                >
                                  <Typography variant="body1">
                                    <IconButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(district.id, "district");
                                      }}
                                    >
                                      <ExpandMoreIcon
                                        style={{
                                          transform: expanded[district.id]
                                            ? "rotate(180deg)"
                                            : "rotate(0deg)",
                                        }}
                                      />
                                    </IconButton>
                                    {district.name}
                                  </Typography>
                                  <Box>
                                    <Tooltip
                                      title={`Add a block under ${district.name}`}
                                    >
                                      <IconButton
                                        color="success"
                                        onClick={() =>
                                          setEditDialog({
                                            open: true,
                                            level: "block",
                                            region: null,
                                            parentId: district.id,
                                            parentName: district.name,
                                          })
                                        }
                                      >
                                        <AddIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Edit ${district.name}`}>
                                      <IconButton
                                        color="warning"
                                        onClick={() =>
                                          setEditDialog({
                                            open: true,
                                            level: "District",
                                            region: district,
                                            parentId: district.id,
                                            parentName: district.name,
                                          })
                                        }
                                      >
                                        <EditIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip
                                      title={`View schools of ${district.name}`}
                                    >
                                      <IconButton
                                        color="primary"
                                        onClick={() =>
                                          handleViewSchools(
                                            "district",
                                            district.name
                                          )
                                        }
                                      >
                                        <SchoolIcon />
                                      </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Delete ${district.name}`}>
                                      <IconButton
                                        color="error"
                                        onClick={() =>
                                          handleConfirmDelete(
                                            district.id,
                                            "district"
                                          )
                                        }
                                      >
                                        <DeleteIcon />
                                      </IconButton>
                                    </Tooltip>
                                  </Box>
                                </Box>

                                <Collapse in={expanded[district.id]}>
                                  {district.blocks?.map((block) => (
                                    <Box ml={6} mt={1} key={block.id}>
                                      {/* Block Level */}
                                      <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{
                                          borderRadius: 1,
                                          cursor: "pointer",
                                          backgroundColor:
                                            selectedRegion?.level === "block" &&
                                            selectedRegion?.id === block.id
                                              ? "secondary.main"
                                              : "transparent",
                                          "&:hover": {
                                            backgroundColor: "#f1f1f1",
                                          },
                                        }}
                                        onClick={() =>
                                          handleRegionClick("block", block)
                                        }
                                      >
                                        <Typography variant="body1">
                                          {block.name}
                                        </Typography>
                                        <Box>
                                          <Tooltip title={`Edit ${block.name}`}>
                                            <IconButton
                                              color="warning"
                                              onClick={() =>
                                                setEditDialog({
                                                  open: true,
                                                  level: "Block",
                                                  region: block,
                                                  parentId: block.id,
                                                  parentName: block.name,
                                                })
                                              }
                                            >
                                              <EditIcon />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip
                                            title={`View schools of ${block.name}`}
                                          >
                                            <IconButton
                                              color="primary"
                                              onClick={() =>
                                                handleViewSchools(
                                                  "block",
                                                  block.name
                                                )
                                              }
                                            >
                                              <SchoolIcon />
                                            </IconButton>
                                          </Tooltip>
                                          <Tooltip
                                            title={`Delete ${block.name}`}
                                          >
                                            <IconButton
                                              color="error"
                                              onClick={() =>
                                                handleConfirmDelete(
                                                  block.id,
                                                  "block"
                                                )
                                              }
                                            >
                                              <DeleteIcon />
                                            </IconButton>
                                          </Tooltip>
                                        </Box>
                                      </Box>
                                    </Box>
                                  ))}
                                </Collapse>
                              </Box>
                            ))}
                          </Collapse>
                        </Box>
                      ))}
                    </Collapse>
                  </CardContent>
                </Card>
              ))}
            </Grid>
            <Grid item size={{ xs: 12, md: 6 }}>
              <Card>
                <CardContent>
                  <Box>
                    <Typography variant="h6">
                      Responsible People for {selectedRegion?.name}
                    </Typography>
                    {isUsersLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      responsibleUsers.map((user) => (
                        <Box
                          key={user.id}
                          className="mt-2 p-2 rounded bg-gray-100 shadow-sm"
                        >
                          {user.access_type === "READ" ? (
                            <Tooltip title="Read-only access">
                              <EditOffTwoTone
                                sx={{ color: "grey", mt: -1, ml: 1 }}
                              />
                            </Tooltip>
                          ) : (
                            <Tooltip title="Write access">
                              <EditTwoTone
                                sx={{ color: "grey", mt: -1, ml: 1 }}
                              />
                            </Tooltip>
                          )}
                          {user.user_name} ({user.role_name})
                        </Box>
                      ))
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
          <Dialog
            open={confirmDelete.open}
            onClose={() =>
              setConfirmDelete({ open: false, id: null, level: "" })
            }
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this {confirmDelete.level}, and
                its associated regions and schools?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  setConfirmDelete({ open: false, id: null, level: "" })
                }
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>{" "}
          <AddRegionDialog
            open={editDialog.open}
            level={editDialog.level}
            parentId={editDialog.parentId}
            parentName={editDialog.parentName}
            handleClose={() =>
              setEditDialog({ open: false, level: "", region: null })
            }
            handleEditRegion={handleEditRegion}
            handleAddRegion={handleAddRegion}
            editData={editDialog.region}
          />
        </>
      )}
    </Box>
  );
}
