import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Button,
  Popover,
  TablePagination,
  Typography,
  Box,
  Paper,
  Container,
  Card,
  TextField,
  MenuItem,
  Input,
  TableSortLabel,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import {
  fetchAllUsersDetails,
  fetchAllUsersDetailsCount,
  bulkUploadUserData,
} from "../../services/UserService";
import { useNavigate, useLocation } from "react-router-dom";
import SnackbarUI from "../Utilities/SnackbarUI";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import { createSlug } from "../Utilities/UtilFuncs";

const UserList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverRoles, setPopoverRoles] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("first_name");
  const queryParams = new URLSearchParams(location.search);
  const [filters, setFilters] = useState({});
  const [file, setFile] = useState(null);
  const [searchField, setSearchField] = useState(
    queryParams?.get("filterby")
      ? `${queryParams.get("filterby")}_name`
      : "name"
  );
  const [searchValue, setSearchValue] = useState(
    queryParams?.get("filtervalue") ? queryParams.get("filtervalue") : ""
  );
  const [page, setPage] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const searchFields = [
    { label: "Name", value: "name" },
    { label: "Phone", value: "phone1" },
    { label: "Email", value: "email" },
    { label: "Role", value: "role_name" },
  ];

  const fetchUsersDetails = async () => {
    try {
      const searchFilters = searchValue
        ? {
            [searchField]: searchValue,
          }
        : {};

      const params = {
        fields: [],
        filters: searchFilters,
        page_no: page + 1,
        page_size: pageSize,
        order_by: [order === "desc" ? `-${orderBy}` : orderBy],
      };

      const response = await fetchAllUsersDetails(params);
      if (response.success) {
        setUsers(response.data);
      } else {
        setSnackbar({
          open: true,
          message: response.error,
          severity: "error",
        });
      }

      const responseCount = await fetchAllUsersDetailsCount(params);
      if (responseCount.success) {
        setTotalCount(responseCount.data?.count || 0);
      } else {
        setSnackbar({
          open: true,
          message: responseCount.error,
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsersDetails();
  }, [page, pageSize, order, filters]);

  useEffect(() => {}, [file]);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const allIds = users.map((user) => user.id);
      setSelectedUsers(allIds);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleDeleteSelected = () => {
    console.log("Deleting users:", selectedUsers);
    // Call your delete API here
    setSelectedUsers([]);
  };

  const handleRolePopover = (event, roles) => {
    setAnchorEl(event.currentTarget);
    setPopoverRoles(roles);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopoverRoles([]);
  };

  const handleCheckboxClick = (id) => {
    const selectedIndex = selectedUsers.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedUsers, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedUsers.slice(1));
    } else if (selectedIndex === selectedUsers.length - 1) {
      newSelected = newSelected.concat(selectedUsers.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedUsers.slice(0, selectedIndex),
        selectedUsers.slice(selectedIndex + 1)
      );
    }
    setSelectedUsers(newSelected);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSearchKeyPress = () => {
    if (location.search) {
      navigate(location.pathname, { replace: true });
    }
    setFilters((prevFilters) => ({
      ...prevFilters,
      [searchField]: { like: searchValue },
    }));
  };

  const handleEdit = (id, name) => {
    sessionStorage.setItem(
      "editUser",
      JSON.stringify({
        id,
        name,
      })
    );
    navigate(`/user/edit/${createSlug(name)}`);
  };

  const handleDelete = async (id) => {
    setSelectedUsers((prev) => prev.filter((selectedId) => selectedId !== id));
    fetchUsersDetails();
  };
  const open = Boolean(anchorEl);

  const handleUpload = async () => {
    console.log("1");
    console.log(file);
    console.log("2");
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await bulkUploadUserData(formData);
      if (!res.success) {
        console.log("res ", res);
        setSnackbar({
          open: true,
          message: res.error,
          severity: "error",
        });
        return;
      }
      setSnackbar({
        open: true,
        message: `Upload Completed!\n\nTotal: ${res.data.total_rows}\nCreated: ${res.data.created}\nRejected: ${res.data.rejected}`,
        severity: "success",
      });
      setFile(null);
      fetchUsersDetails();
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  const handleDownloadTemplate = async () => {
    window.open(
      "public/File_formats/Teachers_And_Students_Upload_Format.xlsx",
      "_blank"
    );
  };

  return (
    <Paper className="p-6">
      <Container maxWidth={false} sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Card className="mb-6 p-4">
          <div className="flex justify-between gap-4 mt-4">
            <TextField
              select
              label="Search By"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="w-1/4"
              sx={{
                borderRadius: "4px 0 0 4px",
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "#0000003b",
                  },
                },
              }}
            >
              {searchFields.map((field) => (
                <MenuItem key={field.value} value={field.value}>
                  {field.label}
                </MenuItem>
              ))}
            </TextField>

            <Input
              type="text"
              placeholder="Enter search string"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full"
            />
            <Button
              variant="contained"
              onClick={handleSearchKeyPress}
              sx={{ width: "100px" }}
            >
              Search
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/user/add")}
              sx={{ width: "200px" }}
            >
              Add New User
            </Button>
          </div>
        </Card>
      </Container>
      <Box className="m-2 p-4">
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleDeleteSelected}
            disabled={selectedUsers.length === 0}
          >
            Delete selected Users
          </Button>
          <div className="flex items-center gap-3">
            {/* File input */}
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <Button
                variant="contained"
                component="span"
                startIcon={<CloudUploadIcon />}
              >
                Choose File
              </Button>
            </label>

            {/* Upload Button */}
            <Button
              variant="contained"
              color="primary"
              disabled={!file}
              onClick={handleUpload}
            >
              Bulk Upload
            </Button>

            {/* Download Template */}
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadTemplate}
            >
              Template
            </Button>
          </div>
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selectedUsers.length > 0 &&
                    selectedUsers.length < selectedUsers.length
                  }
                  checked={
                    selectedUsers.length === users.length && users.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell
                sortDirection={orderBy === "first_name" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "first_name"}
                  direction={orderBy === "first_name" ? order : "asc"}
                  onClick={() => handleRequestSort("first_name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "username" ? order : false}>
                <TableSortLabel
                  active={orderBy === "username"}
                  direction={orderBy === "username" ? order : "asc"}
                  onClick={() => handleRequestSort("username")}
                >
                  Username
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "email" ? order : false}>
                <TableSortLabel
                  active={orderBy === "email"}
                  direction={orderBy === "email" ? order : "asc"}
                  onClick={() => handleRequestSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "phone1" ? order : false}>
                <TableSortLabel
                  active={orderBy === "phone1"}
                  direction={orderBy === "phone1" ? order : "asc"}
                  onClick={() => handleRequestSort("phone1")}
                >
                  Phone
                </TableSortLabel>
              </TableCell>
              <TableCell>Roles</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => {
              const fullName = `${user.first_name} ${user.last_name}`;
              return (
                <TableRow key={user.id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={selectedUsers.indexOf(user.id) !== -1}
                      onChange={() => handleCheckboxClick(user.id)}
                    />
                  </TableCell>
                  <TableCell>{fullName}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone1}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={(e) => handleRolePopover(e, user.roles)}
                    >
                      {user.roles.length}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() =>
                        handleEdit(
                          user.id,
                          `${user.first_name} ${user.last_name}`
                        )
                      }
                    >
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user.id)}>
                      <Delete color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalCount}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />

        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box p={2}>
            <Typography variant="h6">Roles</Typography>
            {popoverRoles.length === 0 ? (
              <Typography variant="body2">No roles assigned</Typography>
            ) : (
              popoverRoles.map((role, idx) => (
                <Box key={idx} my={1}>
                  <Typography variant="body2" fontWeight="bold">
                    {role.role_name} ({role.level})
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {role.class_name || role.school_name || role.block_name}
                  </Typography>
                </Box>
              ))
            )}
          </Box>
        </Popover>
      </Box>
      <SnackbarUI snackbar={snackbar} setSnackbar={setSnackbar} />
    </Paper>
  );
};

export default UserList;
