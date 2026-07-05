import {
  AppBar, Box, Button, Divider, ListItemIcon,
  Menu, MenuItem, Toolbar, Typography
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlined";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => setAnchorEl(null);

  const handleNavigate = (path: string) => {
    handleCloseMenu();
    navigate(path);
  };

  const handleLogout = () => {
    handleCloseMenu();
    logout();
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between", minHeight: "56px !important", px: 3 }}>

        {/* Logo */}
        <Typography
          variant="h6"
          onClick={() => navigate("/")}
          sx={{
            cursor: "pointer",
            fontWeight: 900,
            fontSize: 20,
            color: "#FF5A5F",
            letterSpacing: "-0.8px",
          }}
        >
          neighborly
        </Typography>

        {/* Center nav links */}
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            onClick={() => navigate("/listings")}
            sx={{ color: "#717171", fontWeight: 400, fontSize: 13, "&:hover": { color: "#222", background: "transparent" } }}
          >
            Browse skills
          </Button>
          {isAuthenticated && (
            <Button
              onClick={() => navigate("/listings/my")}
              sx={{ color: "#717171", fontWeight: 400, fontSize: 13, "&:hover": { color: "#222", background: "transparent" } }}
            >
              My listings
            </Button>
          )}
        </Box>

        {/* Right side */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          {isAuthenticated ? (
            <>
              {/* Offer a skill CTA */}
              <Button
                variant="outlined"
                onClick={() => navigate("/listings/create")}
                sx={{
                  borderColor: "#222",
                  color: "#222",
                  fontWeight: 600,
                  fontSize: 13,
                  borderRadius: "8px",
                  py: 0.75,
                  "&:hover": { borderColor: "#222", background: "#F7F7F7" },
                }}
              >
                Offer a skill
              </Button>

              {/* User menu trigger — hamburger + avatar */}
              <Box
                onClick={handleOpenMenu}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  border: "0.5px solid #DDDDDD",
                  borderRadius: "22px",
                  padding: "5px 10px 5px 14px",
                  cursor: "pointer",
                  transition: "box-shadow 0.15s",
                  "&:hover": { boxShadow: "0 2px 6px rgba(0,0,0,0.12)" },
                }}
              >
                <MenuIcon sx={{ fontSize: 16, color: "#222" }} />
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: "#FF5A5F",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </Box>
              </Box>

              {/* Dropdown menu */}
              <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      border: "0.5px solid #EBEBEB",
                      borderRadius: "12px",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
                      overflow: "visible",
                      // Arrow pointer
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: -6,
                        right: 18,
                        width: 12,
                        height: 12,
                        background: "#fff",
                        border: "0.5px solid #EBEBEB",
                        borderBottom: "none",
                        borderRight: "none",
                        transform: "rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
              >
                {/* User info header */}
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#222" }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography sx={{ fontSize: 12, color: "#717171" }}>
                    {user?.email}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#EBEBEB" }} />

                <MenuItem
                  onClick={() => handleNavigate("/profile")}
                  sx={{ py: 1.25, px: 2, gap: 1.5, "&:hover": { background: "#F7F7F7" } }}
                >
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <PersonOutlineIcon sx={{ fontSize: 18, color: "#222" }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: 13, color: "#222" }}>Profile</Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => handleNavigate("/listings/my")}
                  sx={{ py: 1.25, px: 2, gap: 1.5, "&:hover": { background: "#F7F7F7" } }}
                >
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <ListAltIcon sx={{ fontSize: 18, color: "#222" }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: 13, color: "#222" }}>My listings</Typography>
                </MenuItem>

                <Divider sx={{ borderColor: "#EBEBEB" }} />

                <MenuItem
                  onClick={handleLogout}
                  sx={{ py: 1.25, px: 2, gap: 1.5, "&:hover": { background: "#FFF0F0" } }}
                >
                  <ListItemIcon sx={{ minWidth: "auto" }}>
                    <LogoutIcon sx={{ fontSize: 18, color: "#FF5A5F" }} />
                  </ListItemIcon>
                  <Typography sx={{ fontSize: 13, color: "#FF5A5F" }}>Log out</Typography>
                </MenuItem>

              </Menu>
            </>
          ) : (
            <>
              <Button
                onClick={() => navigate("/login")}
                sx={{ color: "#222", fontWeight: 500, fontSize: 13 }}
              >
                Log in
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/register")}
                sx={{ fontSize: 13, borderRadius: "8px", py: 0.75 }}
              >
                Sign up
              </Button>
            </>
          )}
        </Box>

      </Toolbar>
    </AppBar>
  );
}