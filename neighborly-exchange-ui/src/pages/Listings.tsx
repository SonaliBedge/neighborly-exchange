import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip,
  CircularProgress, Typography, Alert, TextField, InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getListings } from "../api/listings";
import type { ListingResponse } from "../types/listings";
import { useAuth } from "../context/AuthContext";

// ── Category color map ─────────────────────────────────────
const categoryColors: Record<string, { border: string; tagBg: string; tagText: string }> = {
  "Education":     { border: "#1D9E75", tagBg: "#E1F5EE", tagText: "#085041" },
  "Home & Garden": { border: "#639922", tagBg: "#EAF3DE", tagText: "#27500A" },
  "Tech":          { border: "#378ADD", tagBg: "#E6F1FB", tagText: "#0C447C" },
  "Childcare":     { border: "#D4537E", tagBg: "#FBEAF0", tagText: "#72243E" },
  "Food":          { border: "#BA7517", tagBg: "#FAEEDA", tagText: "#633806" },
  "Transport":     { border: "#7F77DD", tagBg: "#EEEDFE", tagText: "#3C3489" },
};

const getColor = (category: string) =>
  categoryColors[category] ?? { border: "#888780", tagBg: "#F1EFE8", tagText: "#444441" };

const CATEGORIES = ["All", "Education", "Home & Garden", "Tech", "Childcare", "Food", "Transport"];

// ── Avatar initials helper ─────────────────────────────────
const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

export default function Listings() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings();
        setListings(data);
      } catch {
        setError("Failed to load listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // ── Live filtering ─────────────────────────────────────────
  const filtered = listings.filter((l) => {
    const matchCat = activeCategory === "All" || l.skillCategory === activeCategory;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.title.toLowerCase().includes(q) ||
      l.description.toLowerCase().includes(q) ||
      l.skillName.toLowerCase().includes(q) ||
      l.userFirstName.toLowerCase().includes(q) ||
      l.userLastName.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>

      {/* ── Page header ───────────────────────────────────── */}
      <Box sx={{ mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Skills available in your neighborhood
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Find a neighbor who can help, or offer your own skills in return.
        </Typography>
      </Box>

      {/* ── Search + CTA row ──────────────────────────────── */}
      <Box sx={{ display: "flex", gap: 1, mt: 2, mb: 1.5 }}>
        <TextField
          size="small"
          placeholder="Search skills, people, or descriptions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1 }}
          slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
              </InputAdornment>
            ),
          },
        }}
        />
        {isAuthenticated && (
          <Button variant="contained" onClick={() => navigate("/listings/create")} sx={{ whiteSpace: "nowrap" }}>
            Offer a skill
          </Button>
        )}
      </Box>

      {/* ── Category filter chips ─────────────────────────── */}
      <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mb: 2 }}>
        {CATEGORIES.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            size="small"
            onClick={() => setActiveCategory(cat)}
            variant={activeCategory === cat ? "filled" : "outlined"}
            color={activeCategory === cat ? "primary" : "default"}
            sx={{ cursor: "pointer" }}
          />
        ))}
      </Box>

      {/* ── Result count ──────────────────────────────────── */}
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        {filtered.length} skill{filtered.length !== 1 ? "s" : ""} available near you
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* ── Empty state ───────────────────────────────────── */}
      {filtered.length === 0 && !error && (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            {search || activeCategory !== "All"
              ? "No skills match your search — try a different category or keyword."
              : "No listings yet — be the first to offer a skill!"}
          </Typography>
          {isAuthenticated && !search && activeCategory === "All" && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/listings/create")}>
              Offer a skill
            </Button>
          )}
        </Box>
      )}

      {/* ── Listing cards ─────────────────────────────────── */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {filtered.map((listing) => {
          const color = getColor(listing.skillCategory);
          const avatarInitials = initials(listing.userFirstName, listing.userLastName);

          return (
            <Box key={listing.id} sx={{ width: { xs: "100%", sm: "calc(50% - 6px)" } }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  borderTop: `3px solid ${color.border}`,
                  transition: "border-color 0.15s",
                  "&:hover": { borderColor: color.border, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" },
                }}
              >
                <CardContent sx={{ pb: "12px !important" }}>

                  {/* Category + skill tags */}
                  <Box sx={{ display: "flex", gap: 0.75, mb: 1.25, flexWrap: "wrap" }}>
                    <Chip
                      label={listing.skillCategory}
                      size="small"
                      sx={{
                        backgroundColor: color.tagBg,
                        color: color.tagText,
                        fontWeight: 500,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                    <Chip
                      label={listing.skillName}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: 11, height: 20 }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.75 }}>
                    {listing.title}
                  </Typography>

                  {/* Description — clamped to 2 lines */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 1.25,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {listing.description}
                  </Typography>

                  {/* Looking for */}
                  {listing.lookingFor && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: "flex", gap: 0.5 }}>
                      🤝 <span>Looking for: <strong>{listing.lookingFor}</strong></span>
                    </Typography>
                  )}

                  {/* Availability */}
                  {listing.availability && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🕐 {listing.availability}
                    </Typography>
                  )}

                  {/* Footer — avatar + name + rating */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1.5,
                      pt: 1.25,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    {/* Avatar + name */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          backgroundColor: color.tagBg,
                          color: color.tagText,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 600,
                          flexShrink: 0,
                        }}
                      >
                        {avatarInitials}
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {listing.userFirstName} {listing.userLastName}
                      </Typography>
                    </Box>

                    {/* Rating */}
                    {listing.userReputationScore > 0 && (
                      <Typography variant="body2" sx={{ color: "#BA7517", fontWeight: 500 }}>
                        ★ {listing.userReputationScore.toFixed(1)}
                      </Typography>
                    )}
                  </Box>

                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Box>

    </Box>
  );
}