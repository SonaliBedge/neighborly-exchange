import { useEffect, useState } from "react";
import {
  Alert, Box, Button, CircularProgress,
  Divider, Paper, TextField, Typography
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditOutlined";
import SaveIcon from "@mui/icons-material/SaveOutlined";
import CloseIcon from "@mui/icons-material/CloseOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOnOutlined";
import StarIcon from "@mui/icons-material/Star";
import { getMyProfile, updateProfile } from "../api/profile";
import type { UserProfile } from "../types/profile";
import { getCategoryConfig } from "../types/categories";

const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

const memberSince = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Edit form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [neighborhood, setNeighborhood] = useState("");

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setProfile(data);
        prefillForm(data);
      })
      .catch(() => setError("Failed to load profile. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const prefillForm = (data: UserProfile) => {
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setBio(data.bio ?? "");
    setNeighborhood(data.neighborhood ?? "");
  };

  const handleEdit = () => {
    if (profile) prefillForm(profile);
    setSaveError("");
    setEditing(true);
  };

  const handleCancel = () => {
    if (profile) prefillForm(profile);
    setSaveError("");
    setEditing(false);
  };

  const handleSave = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setSaveError("First and last name are required.");
      return;
    }
    setSaving(true);
    setSaveError("");
    try {
      const updated = await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim() || undefined,
        neighborhood: neighborhood.trim() || undefined,
      });
      setProfile(updated);
      setEditing(false);
    } catch {
      setSaveError("Failed to save changes. Please try again.");
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

  if (error || !profile) {
    return (
      <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, px: 3 }}>
        <Alert severity="error">{error || "Profile not found."}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#F7F7F7", minHeight: "100vh" }}>

      {/* ── Cover ── */}
      <Box sx={{ background: "#222222", height: 100 }} />

      <Box sx={{ maxWidth: 720, mx: "auto", px: 3 }}>

        {/* ── Avatar + name header ── */}
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 2, mt: "-40px", mb: 3 }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "#FF5A5F",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              border: "3px solid white",
              flexShrink: 0,
            }}
          >
            {initials(profile.firstName, profile.lastName)}
          </Box>
          <Box sx={{ pb: 0.5, flex: 1 }}>
            <Typography variant="h5" sx={{ color: "#222", fontWeight: 800, letterSpacing: "-0.4px" }}>
              {profile.firstName} {profile.lastName}
            </Typography>
            {profile.neighborhood && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LocationOnIcon sx={{ fontSize: 14, color: "#717171" }} />
                <Typography variant="body2" color="text.secondary">
                  {profile.neighborhood}
                </Typography>
              </Box>
            )}
          </Box>
          {!editing && (
            <Button
              startIcon={<EditIcon sx={{ fontSize: 16 }} />}
              variant="outlined"
              onClick={handleEdit}
              sx={{
                borderColor: "#DDDDDD",
                color: "#222",
                fontWeight: 500,
                fontSize: 13,
                borderRadius: "8px",
                "&:hover": { borderColor: "#222", background: "#F7F7F7" },
              }}
            >
              Edit profile
            </Button>
          )}
        </Box>

        {/* ── Stats row ── */}
        <Paper
          variant="outlined"
          sx={{
            borderRadius: "12px",
            border: "0.5px solid #EBEBEB",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            mb: 2,
          }}
        >
          <Box sx={{ textAlign: "center", py: 2, borderRight: "0.5px solid #EBEBEB" }}>
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}>
              <StarIcon sx={{ fontSize: 16, color: "#FFBE00" }} />
              <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>
                {profile.reputationScore > 0 ? profile.reputationScore.toFixed(1) : "—"}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">Rating</Typography>
          </Box>
          <Box sx={{ textAlign: "center", py: 2, borderRight: "0.5px solid #EBEBEB" }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>
              {profile.totalExchanges}
            </Typography>
            <Typography variant="caption" color="text.secondary">Exchanges</Typography>
          </Box>
          <Box sx={{ textAlign: "center", py: 2 }}>
            <Typography sx={{ fontSize: 22, fontWeight: 800, color: "#222", letterSpacing: "-0.5px" }}>
              {profile.skillsOffered.length}
            </Typography>
            <Typography variant="caption" color="text.secondary">Skills offered</Typography>
          </Box>
        </Paper>

        {/* ── Edit form ── */}
        {editing && (
          <Paper
            variant="outlined"
            sx={{ borderRadius: "12px", border: "0.5px solid #EBEBEB", p: 3, mb: 2 }}
          >
            <Typography variant="h6" sx={{ mb: 2 }}>Edit profile</Typography>
            {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
            <form onSubmit={handleSave}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
                <TextField
                  label="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
                <TextField
                  label="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  fullWidth
                  size="small"
                />
              </Box>
              <TextField
                label="Neighborhood"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                fullWidth
                size="small"
                placeholder="e.g. El Dorado Hills, CA"
                sx={{ mb: 2 }}
              />
              <TextField
                label="Bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                fullWidth
                multiline
                rows={3}
                size="small"
                placeholder="Tell your neighbors a bit about yourself..."
                sx={{ mb: 2.5 }}
              />
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon sx={{ fontSize: 16 }} />}
                  disabled={saving}
                  sx={{ borderRadius: "8px", fontSize: 13 }}
                >
                  {saving ? "Saving..." : "Save changes"}
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon sx={{ fontSize: 16 }} />}
                  onClick={handleCancel}
                  disabled={saving}
                  sx={{ borderColor: "#DDDDDD", color: "#222", borderRadius: "8px", fontSize: 13 }}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Paper>
        )}

        {/* ── About ── */}
        <Paper
          variant="outlined"
          sx={{ borderRadius: "12px", border: "0.5px solid #EBEBEB", p: 3, mb: 2 }}
        >
          <Typography variant="h6" sx={{ mb: 1.5 }}>About</Typography>
          <Divider sx={{ mb: 2 }} />
          {profile.bio ? (
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8 }}>
              {profile.bio}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              No bio yet.{" "}
              {!editing && (
                <Box
                  component="span"
                  onClick={handleEdit}
                  sx={{ color: "#FF5A5F", cursor: "pointer", textDecoration: "underline" }}
                >
                  Add one
                </Box>
              )}
            </Typography>
          )}
          <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 0.75 }}>
            <Typography variant="body2" color="text.secondary">
              📧 {profile.email}
            </Typography>
            {profile.neighborhood && (
              <Typography variant="body2" color="text.secondary">
                📍 {profile.neighborhood}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              📅 Member since {memberSince(profile.createdAt)}
            </Typography>
          </Box>
        </Paper>

        {/* ── Skills offered ── */}
        <Paper
          variant="outlined"
          sx={{ borderRadius: "12px", border: "0.5px solid #EBEBEB", p: 3, mb: 4 }}
        >
          <Typography variant="h6" sx={{ mb: 1.5 }}>Skills offered</Typography>
          <Divider sx={{ mb: 2 }} />
          {profile.skillsOffered.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
              No active listings yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {profile.skillsOffered.map((skill) => {
                const config = getCategoryConfig(skill);
                return (
                  <Box
                    key={skill}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      background: config.iconBg,
                      border: `0.5px solid ${config.iconBg}`,
                      borderRadius: "8px",
                      px: 1.5,
                      py: 0.75,
                    }}
                  >
                    <Box sx={{ fontSize: 16 }}>{config.emoji}</Box>
                    <Typography
                      sx={{ fontSize: 13, fontWeight: 500, color: config.catColor }}
                    >
                      {skill}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>

      </Box>
    </Box>
  );
}