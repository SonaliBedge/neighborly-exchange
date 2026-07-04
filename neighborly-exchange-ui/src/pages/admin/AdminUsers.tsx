import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import { getAdminUsers, toggleLockUser, type AdminUser } from "../../api/admin";
import AdminLayout from "../../components/AdminLayout";

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    getAdminUsers()
      .then(setUsers)
      .catch(() => setError("Failed to load users."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggleLock = async (id: number) => {
    setTogglingId(id);
    try {
      const result = await toggleLockUser(id);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isLocked: result.isLocked } : u))
      );
    } catch {
      setError("Failed to update user.");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Users
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && <CircularProgress />}

        {!loading && (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F1F5F9" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Neighborhood</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Reputation</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: "text.secondary" }}>
                      {user.email}
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: "text.secondary" }}>
                      {user.neighborhood ?? "—"}
                    </TableCell>
                    <TableCell>
                      {user.roles.includes("Admin") ? (
                        <Chip label="Admin" size="small"
                          sx={{ backgroundColor: "#DBEAFE", color: "#1E40AF", fontSize: 11 }} />
                      ) : (
                        <Chip label="Member" size="small" variant="outlined"
                          sx={{ fontSize: 11 }} />
                      )}
                    </TableCell>
                    <TableCell>
                      {user.reputationScore > 0
                        ? `★ ${user.reputationScore.toFixed(1)}`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.isLocked ? "Locked" : "Active"}
                        size="small"
                        sx={{
                          fontSize: 11,
                          backgroundColor: user.isLocked ? "#FEE2E2" : "#DCFCE7",
                          color: user.isLocked ? "#991B1B" : "#166534",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {!user.roles.includes("Admin") && (
                        <Button
                          size="small"
                          variant="outlined"
                          color={user.isLocked ? "success" : "error"}
                          disabled={togglingId === user.id}
                          onClick={() => handleToggleLock(user.id)}
                        >
                          {togglingId === user.id
                            ? "..."
                            : user.isLocked
                            ? "Unlock"
                            : "Lock"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AdminLayout>
  );
}