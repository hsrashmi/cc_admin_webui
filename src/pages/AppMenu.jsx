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
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useLocation } from "react-router-dom";

const AppMenu = () => {
  const location = useLocation();

  // State to track which menu is open along with its anchor element.
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuOpen = (menuName, event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(menuName);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setOpenMenu(null);
  };

  // Hide navbar on login page and homepage
  if (location.pathname === "/login" || location.pathname === "/") return null;

  // Common styling for each submenu's Paper and MenuItem
  const menuPaperProps = {
    elevation: 0, // Remove the default shadow
    sx: { backgroundColor: "primary.main", boxShadow: "none" },
  };

  const menuItemSx = { color: "secondary.main" };

  return (
    <AppBar position="static">
      <Toolbar className="flex justify-between bg-primary">
        {/* Logo on the left */}
        <div className="flex items-center space-x-2 text-white">
          <IconButton edge="start" color="secondary" aria-label="menu">
            <MenuBookIcon />
          </IconButton>
          <Typography variant="h5" color="secondary">
            Career Compass (Admin)
          </Typography>
        </div>

        {/* Menu items on the right */}
        <div className="space-x-4">
          {/* User menu with dropdown */}
          <Button
            onClick={(e) => handleMenuOpen("user", e)}
            color="secondary"
            className="hover:bg-yellow-600"
          >
            User
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu === "user"}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
          >
            <MenuItem
              component={Link}
              to="/user/user"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              User
            </MenuItem>
            <MenuItem
              component={Link}
              to="/user/assocation"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Association
            </MenuItem>
          </Menu>

          {/* Region menu with dropdown */}
          <Button
            onClick={(e) => handleMenuOpen("region", e)}
            color="secondary"
            className="hover:bg-yellow-600"
          >
            Region
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu === "region"}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
          >
            <MenuItem
              component={Link}
              to="/region/state"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              State
            </MenuItem>
            <MenuItem
              component={Link}
              to="/region/zone"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Zone
            </MenuItem>
            <MenuItem
              component={Link}
              to="/region/district"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              District
            </MenuItem>
            <MenuItem
              component={Link}
              to="/region/block"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Block
            </MenuItem>
            <MenuItem
              component={Link}
              to="/region/village"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Village
            </MenuItem>
          </Menu>

          {/* School menu with dropdown */}
          <Button
            onClick={(e) => handleMenuOpen("school", e)}
            color="secondary"
            className="hover:bg-yellow-600"
          >
            School
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu === "school"}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
          >
            <MenuItem
              component={Link}
              to="/school/school"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              School
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/class"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Class
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/teacher"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Teacher
            </MenuItem>
            <MenuItem
              component={Link}
              to="/school/student"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Student
            </MenuItem>
          </Menu>

          {/* Activity menu with dropdown */}
          <Button
            onClick={(e) => handleMenuOpen("activity", e)}
            color="secondary"
            className="hover:bg-yellow-600"
          >
            Activity
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu === "activity"}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
          >
            <MenuItem
              component={Link}
              to="/activity/main"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Activity
            </MenuItem>
            <MenuItem
              component={Link}
              to="/activity/asset"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Asset
            </MenuItem>
          </Menu>

          {/* Profile menu with dropdown */}
          <Button
            onClick={(e) => handleMenuOpen("profile", e)}
            color="secondary"
            className="hover:bg-yellow-600"
          >
            Profile
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={openMenu === "profile"}
            onClose={handleMenuClose}
            PaperProps={menuPaperProps}
          >
            <MenuItem
              component={Link}
              to="/profile/account"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Account
            </MenuItem>
            <MenuItem
              component={Link}
              to="/profile/help"
              onClick={handleMenuClose}
              sx={menuItemSx}
            >
              Help
            </MenuItem>
            <MenuItem
              component={Link}
              to="/logout"
              onClick={handleMenuClose}
              sx={menuItemSx}
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
