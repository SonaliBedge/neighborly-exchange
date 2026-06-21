import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert, Paper } from "@mui/material";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginApi({ email, password });
      login(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Log In</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </form>
        <Typography sx={{ mt: 2, fontSize: 14 }}>
          Don't have an account? <Link to="/register">Register</Link>
        </Typography>
      </Paper>
    </Box>
  );
}