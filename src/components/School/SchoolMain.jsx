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
  Box,
  MenuItem,
  Select,
  Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SchoolMain = () => {
  const navigate = useNavigate();
  const [schools, setSchools] = useState([]);
  const [selected, setSelected] = useState([]);

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("name");

  const [filters, setFilters] = useState({});
  const [searchField, setSearchField] = useState("name");
  const [searchValue, setSearchValue] = useState("");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    fetchSchools();
  }, [page, rowsPerPage, order, filters]);

  const fetchSchools = async () => {
    try {
      const searchFilters = searchValue
        ? {
            [searchField]: { ilike: searchValue },
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
    console.log("Delete school with id:", id);
    setSelected((prev) => prev.filter((selectedId) => selectedId !== id));
    fetchSchools();
  };

  const handleSearchKeyPress = (event) => {
    if (event.key === "Enter") {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [searchField]: { like: searchValue },
      }));
    }
  };

  return (
    <Container maxWidth={false} sx={{ marginTop: 4 }}>
      <Typography variant="h4" gutterBottom>
        School Management
      </Typography>
      <Box display="flex" justifyContent="flex-end" gap={2} alignItems="center">
        <Box display="flex">
          <Select
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
            variant="outlined"
            size="small"
            sx={{
              width: "150px",
              borderRadius: "4px 0 0 4px",
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#0000003b", // Change border color on hover
                },
              },
            }}
          >
            {[
              { id: "name", label: "School Name" },
              { id: "dise_code", label: "Dise Code" },
              { id: "block_name", label: "Block" },
              { id: "district_name", label: "District" },
              { id: "zone_name", label: "Zone" },
              { id: "state_name", label: "State" },
              { id: "address", label: "Address" },
            ].map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchKeyPress}
            sx={{
              width: "250px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "0 4px 4px 0", // Ensure borderRadius applies to the fieldset
                },
                "&:hover fieldset": {
                  borderColor: "#0000003b", // Change border color on hover
                },
              },
            }}
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/school/add")}
        >
          Add New School
        </Button>
      </Box>
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
                      onClick={() => navigate(`/school/${school.id}/manage`)}
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
    </Container>
  );
};

export default SchoolMain;
