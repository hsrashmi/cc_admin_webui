import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { Link, useLocation } from "react-router-dom";

const AppMenu = () => {
  const location = useLocation();

  // Hide navbar on login page
  if ((location.pathname === "/login") | (location.pathname === "/"))
    return null;

  return (
    <>
      <AppBar position="static">
        <Toolbar className="flex justify-between bg-secondary">
          {/* Logo on the left */}
          <div className="flex items-center space-x-2 text-white">
            <IconButton edge="start" color="primary" aria-label="menu">
              <MenuBookIcon />
            </IconButton>
            <Typography variant="h6" color="primary">
              Career Compass (Admin)
            </Typography>
          </div>

          {/* Menu items on the right */}
          <div className="space-x-4">
            <Button
              component={Link}
              to="/user"
              color="primary"
              className="hover:bg-yellow-600"
            >
              Users
            </Button>
            <Button
              component={Link}
              to="/school"
              color="primary"
              className="hover:bg-yellow-600"
            >
              Schools
            </Button>
            <Button
              component={Link}
              to="/logout"
              color="primary"
              className="hover:bg-yellow-600"
            >
              Logout
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default AppMenu;
