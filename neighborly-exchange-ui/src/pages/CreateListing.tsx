import { useEffect, useState } from "react";
import {
  Alert, Box, Button, FormControl,
  InputLabel, MenuItem, Paper,
  Select, TextField, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getSkills, createListing } from "../api/listings";
import type { Skill } from "../types/listings";

export default function CreateListing() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load skill categories on mount
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
        if (data.length > 0) setSkillId(data[0].id);
      } catch {
        setError("Failed to load skills. Please try again.");
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    if (!skillId) {
      setError("Please select a skill category.");
      return;
    }

    setLoading(true);
    try {
      await createListing({
        skillId,
        title,
        description,
        availability: availability || undefined,
      });
      navigate("/listings");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create listing. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 560 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Offer a Skill
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Tell your neighbors what you can help with.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>

          {/* Skill dropdown */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Skill Category</InputLabel>
            <Select
              value={skillId}
              label="Skill Category"
              onChange={(e) => setSkillId(Number(e.target.value))}
            >
              {skills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name} — {skill.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Title */}
          <TextField
            label="Listing Title"
            fullWidth
            margin="normal"
            required
            placeholder="e.g. Algebra tutoring, evenings"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Description */}
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            required
            multiline
            rows={4}
            placeholder="Describe what you can help with, your experience, any relevant details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Availability */}
          <TextField
            label="Availability (optional)"
            fullWidth
            margin="normal"
            placeholder="e.g. Weekday evenings, Saturday mornings"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? "Posting..." : "Post Listing"}
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/listings")}
            >
              Cancel
            </Button>
          </Box>

        </form>
      </Paper>
    </Box>
  );
}