import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
  TextField, Typography
} from "@mui/material";
import { getAdminSkills, addSkill, deleteSkill, type AdminSkill } from "../../api/admin";
import AdminLayout from "../../components/AdminLayout";

export default function AdminSkills() {
  const [skills, setSkills] = useState<AdminSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    getAdminSkills()
      .then(setSkills)
      .catch(() => setError("Failed to load skills."))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!newName.trim() || !newCategory.trim()) return;
    setSaving(true);
    try {
      const created = await addSkill({ name: newName.trim(), category: newCategory.trim() });
      setSkills((prev) => [...prev, created]);
      setNewName("");
      setNewCategory("");
    } catch {
      setError("Failed to add skill.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this skill category?")) return;
    setDeletingId(id);
    try {
      await deleteSkill(id);
      setSkills((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to delete skill.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Skill categories
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Manage the skills neighbors can offer and request.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Add new skill form */}
        <Paper variant="outlined" sx={{ p: 2.5, mb: 3, borderRadius: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Add new skill
          </Typography>
          <form onSubmit={handleAdd}>
            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
              <TextField
                size="small"
                label="Skill name"
                placeholder="e.g. Piano lessons"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                sx={{ flex: 1, minWidth: 180 }}
              />
              <TextField
                size="small"
                label="Category"
                placeholder="e.g. Education"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required
                sx={{ flex: 1, minWidth: 180 }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                sx={{ whiteSpace: "nowrap" }}
              >
                {saving ? "Adding..." : "Add skill"}
              </Button>
            </Box>
          </form>
        </Paper>

        {loading && <CircularProgress />}

        {!loading && (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F1F5F9" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Skill name</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {skills.map((skill) => (
                  <TableRow key={skill.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{skill.name}</TableCell>
                    <TableCell>
                      <Chip label={skill.category} size="small"
                        variant="outlined" sx={{ fontSize: 11 }} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={deletingId === skill.id}
                        onClick={() => handleDelete(skill.id)}
                      >
                        {deletingId === skill.id ? "..." : "Delete"}
                      </Button>
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