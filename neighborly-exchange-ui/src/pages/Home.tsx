import { Box, Button, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="h5">Welcome to Neighborly Exchange</Typography>
        <Button sx={{ mt: 2 }} variant="contained" onClick={() => navigate("/login")}>
          Log In
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h5">Welcome back, {user?.firstName}!</Typography>
      <Button sx={{ mt: 2 }} variant="outlined" onClick={logout}>
        Log Out
      </Button>
    </Box>
  );
}