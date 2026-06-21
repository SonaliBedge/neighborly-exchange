import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Box, Button, TextField, Typography, Alert, Paper } from "@mui/material";
import { register } from "../api/auth";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
      const data = await register({ firstName, lastName, email, password });
      login(data);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Create an Account</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField label="First Name" fullWidth margin="normal" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} required />
          <TextField label="Last Name" fullWidth margin="normal" value={lastName}
            onChange={(e) => setLastName(e.target.value)} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </Button>
        </form>
        <Typography sx={{ mt: 2, fontSize: 14 }}>
          Already have an account? <Link to="/login">Log in</Link>
        </Typography>
      </Paper>
    </Box>
  );
}