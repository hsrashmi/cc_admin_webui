import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useLocation } from "react-router-dom";

const AppMenu = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  if (location.pathname === "/login" || location.pathname === "/") return null;

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between bg-primary">
        <div className="flex items-center space-x-2 text-white">
          <IconButton edge="start" color="secondary" aria-label="menu">
            <MenuBookIcon />
          </IconButton>
          <Typography
            variant="h5"
            color="secondary"
            component={Link}
            to="/home"
          >
            Career Compass (Admin)
          </Typography>
        </div>

        <div className="flex items-center space-x-4">
          <Button component={Link} to="/users" color="secondary">
            Users
          </Button>
          <Button component={Link} to="/schools" color="secondary">
            Schools
          </Button>
          <Button component={Link} to="/regions" color="secondary">
            Regions
          </Button>
          <Button component={Link} to="/activities" color="secondary">
            Activities
          </Button>

          {/* Profile menu with dropdown */}
          <IconButton onClick={handleMenuOpen} color="secondary">
            <AccountCircleIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            PaperProps={{ sx: { backgroundColor: "primary.main" } }}
          >
            <MenuItem
              component={Link}
              to="/profile/account"
              onClick={handleMenuClose}
              sx={{ color: "secondary.main" }}
            >
              Account
            </MenuItem>
            <MenuItem
              component={Link}
              to="/profile/help"
              onClick={handleMenuClose}
              sx={{ color: "secondary.main" }}
            >
              Help
            </MenuItem>
            <MenuItem
              component={Link}
              to="/logout"
              onClick={handleMenuClose}
              sx={{ color: "secondary.main" }}
            >
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default AppMenu;
