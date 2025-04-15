import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  IconButton,
  Checkbox,
  TablePagination,
  TextField,
  Card,
  MenuItem,
  Input,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SchoolMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [schools, setSchools] = useState([]);
  const [selected, setSelected] = useState([]);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("name");

  const queryParams = new URLSearchParams(location.search);

  const [filters, setFilters] = useState({});

  const [searchField, setSearchField] = useState(
    queryParams?.get("filterby")
      ? `${queryParams.get("filterby")}_name`
      : "name"
  );

  const [searchValue, setSearchValue] = useState(
    queryParams?.get("filtervalue") ? queryParams.get("filtervalue") : ""
  );

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const searchFields = [
    { label: "School Name", value: "name" },
    { label: "Dise Code", value: "dise_code" },
    { label: "Block", value: "block_name" },
    { label: "District", value: "district_name" },
    { label: "Zone", value: "zone_name" },
    { label: "State", value: "state_name" },
    { label: "Address", value: "address" },
  ];

  useEffect(() => {
    fetchSchools();
  }, [page, rowsPerPage, order, filters]);

  const fetchSchools = async () => {
    try {
      const searchFilters = searchValue
        ? {
            [searchField]: searchValue,
          }
        : {};

      const response = await axios.post(
        "http://localhost:8000/ilp/v1/allSchoolDetails",
        {
          fields: [],
          filters: searchFilters,
          page: page + 1,
          page_size: rowsPerPage,
          order_by: [order === "desc" ? `-${orderBy}` : orderBy],
        }
      );
      setSchools(response.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = schools.map((n) => n.id);
      setSelected(newSelected);
    } else {
      setSelected([]);
    }
  };

  const handleCheckboxClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (id) => {
    navigate(`/school/edit/${id}`);
  };

  const handleDelete = async (id) => {
    setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
    fetchSchools();
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

  return (
    <Paper className="p-6">
      <Container maxWidth={false} sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          School Management
        </Typography>
        <Card className="mb-6 p-4">
          <div className="flex gap-4 mt-4">
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
              className="w-1/2"
            />
            <Button variant="contained" onClick={handleSearchKeyPress}>
              Search
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/school/add")}
            >
              Add New School
            </Button>
          </div>
        </Card>
      </Container>
      <Paper sx={{ marginTop: 4, padding: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  indeterminate={
                    selected.length > 0 && selected.length < schools.length
                  }
                  checked={
                    schools.length > 0 && selected.length === schools.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              {[
                "name",
                "dise_code",
                "block_name",
                "district_name",
                "zone_name",
                "state_name",
                "address",
              ].map((field) => (
                <TableCell key={field}>
                  <TableSortLabel
                    active={orderBy === field}
                    direction={order}
                    onClick={() => handleRequestSort(field)}
                  >
                    {field.replace("_", " ").toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools.map((school) => {
              const isItemSelected = isSelected(school.id);
              return (
                <TableRow key={school.id} hover selected={isItemSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      onChange={(event) =>
                        handleCheckboxClick(event, school.id)
                      }
                    />
                  </TableCell>
                  {[
                    "name",
                    "dise_code",
                    "block_name",
                    "district_name",
                    "zone_name",
                    "state_name",
                    "address",
                  ].map((field) => (
                    <TableCell key={field}>{school[field]}</TableCell>
                  ))}
                  <TableCell align="right">
                    <IconButton onClick={() => handleEdit(school.id)}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(school.id)}>
                      <Delete color="primary" />
                    </IconButton>
                    <IconButton
                      onClick={() => navigate(`/school/manage/${school.id}`)}
                    >
                      <ManageAccountsIcon color="primary" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={-1}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>
    </Paper>
  );
};

export default SchoolMain;
