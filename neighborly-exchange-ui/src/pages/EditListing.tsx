import { useEffect, useState } from "react";
import {
  Alert, Box, Button, FormControl,
  InputLabel, MenuItem, Paper,
  Select, TextField, Typography, CircularProgress
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { getSkills, getMyListings, updateListing } from "../api/listings";
import type { Skill } from "../types/listings";

export default function EditListing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillId, setSkillId] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [lookingFor, setLookingFor] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [skillsData, myListings] = await Promise.all([
          getSkills(),
          getMyListings(),
        ]);
        setSkills(skillsData);

        const listing = myListings.find((l) => l.id === Number(id));
        if (!listing) {
          setError("Listing not found or you don't have permission to edit it.");
          return;
        }

        // Pre-fill the form with existing values
        const matchedSkill = skillsData.find((s) => s.name === listing.skillName);
        setSkillId(matchedSkill?.id ?? skillsData[0]?.id ?? 0);
        setTitle(listing.title);
        setDescription(listing.description);
        setAvailability(listing.availability ?? "");
        setLookingFor(listing.lookingFor ?? "");
      } catch {
        setError("Failed to load listing. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!skillId) { setError("Please select a skill category."); return; }
    setSaving(true);
    try {
      await updateListing(Number(id), {
        skillId,
        title,
        description,
        availability: availability || undefined,
        lookingFor: lookingFor || undefined,
      });
      navigate("/listings/my");
    } catch {
      setError("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6, px: 2 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 560 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Edit listing
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Update the details of your skill offering.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Skill category</InputLabel>
            <Select
              value={skillId}
              label="Skill category"
              onChange={(e) => setSkillId(Number(e.target.value))}
            >
              {skills.map((skill) => (
                <MenuItem key={skill.id} value={skill.id}>
                  {skill.name} — {skill.category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Listing title"
            fullWidth margin="normal" required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <TextField
            label="Description"
            fullWidth margin="normal" required
            multiline rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            label="Availability (optional)"
            fullWidth margin="normal"
            placeholder="e.g. Weekday evenings, Saturday mornings"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />

          <TextField
            label="Looking for in return (optional)"
            fullWidth margin="normal"
            placeholder="e.g. Help with gardening, cooking lessons..."
            value={lookingFor}
            onChange={(e) => setLookingFor(e.target.value)}
          />

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" fullWidth disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <Button variant="outlined" fullWidth onClick={() => navigate("/listings/my")}>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}