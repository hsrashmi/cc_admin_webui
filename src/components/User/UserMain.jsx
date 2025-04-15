import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  MenuItem,
  Button,
  Card,
  Container,
  Typography,
  Input,
  Paper,
} from "@mui/material";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

const searchFields = [
  { label: "Name", value: "name" },
  { label: "Role", value: "role" },
  { label: "Email", value: "email" },
  { label: "Phone", value: "phone" },
];

export default function UserMain() {
  const [searchType, setSearchType] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    // Implement API call to fetch users based on searchType and searchQuery
    console.log(`Searching for ${searchQuery} by ${searchType}`);
  };

  return (
    <Paper className="p-6">
      <Container maxWidth={false} sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Card className="mb-6 p-4">
          <div className="flex gap-4 mt-4">
            <TextField
              select
              label="Search By"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-1/4"
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-1/2"
            />
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="contained"
              className="ml-4"
              onClick={() => navigate("/user/add")}
            >
              Add New User
            </Button>
          </div>
        </Card>
      </Container>
      <Card className="mb-6 p-4">
        <Typography variant="h6">User List</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>School Name</TableCell>
              <TableCell>DISE Code</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.school_name}</TableCell>
                  <TableCell>{user.dise_code}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </Paper>
  );
}
