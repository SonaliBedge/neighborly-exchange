import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = (() => {
    const token = localStorage.getItem("token");
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const roles = Array.isArray(payload.role) ? payload.role : payload.role ? [payload.role] : [];
      return roles.includes("Admin");
    } catch { return false; }
  })();
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar>
        {/* Logo / brand */}
        <Typography
        variant="h6"
        sx={{ cursor: "pointer", flexGrow: 1, fontWeight: "bold" }}
        onClick={() => navigate("/")}
        >
          Neighborly Exchange
        </Typography>

        {/* Nav links */}
        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          <Button color="inherit" onClick={() => navigate("/listings")}>
            Browse Skills
          </Button>

          {isAuthenticated ? (
            <>              
              <Button color="inherit" onClick={() => navigate("/listings/my")}>
                My Listings
              </Button>
              {isAdmin && (
                <Button
                  color="inherit"
                  onClick={() => navigate("/admin")}
                  sx={{ backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 1 }}
                >
                  Admin
                </Button>
              )}
              <Button color="inherit" onClick={() => navigate("/listings/create")}>
                Offer a Skill
              </Button>
              <Typography variant="body2" sx={{ mx: 1, opacity: 0.8 }}>
                Hi, {user?.firstName}
              </Typography>
              <Button color="inherit" variant="outlined" onClick={logout}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate("/login")}>
                Log In
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}