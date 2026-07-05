import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, Typography, Alert } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getListings } from "../api/listings";
import type { ListingResponse } from "../types/listings";
import { useAuth } from "../context/AuthContext";
import SkillCard from "../components/SkillCard";
import { getCategoryConfig, ALL_CATEGORIES } from "../types/categories";

const CATEGORY_ICONS: Record<string, string> = {
  "All": "🏠",
  "Education": "📚",
  "Home & Garden": "🌿",
  "Tech": "💻",
  "Childcare": "👶",
  "Food": "🍳",
  "Transport": "🚗",
  "Other": "🤝",
};

export default function Listings() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    getListings()
      .then(setListings)
      .catch(() => setError("Failed to load listings. Please try again."))
      .finally(() => setLoading(false));
  }, []);

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
      <Box>
        {/* Search header skeleton */}
        <Box sx={{ background: "#fff", borderBottom: "0.5px solid #EBEBEB", px: 3, pt: 2.5, pb: 0 }}>
          <Box sx={{ height: 24, width: 200, background: "#F0F0F0", borderRadius: 1, mb: 1 }} />
          <Box sx={{ height: 44, background: "#F0F0F0", borderRadius: "40px", mb: 2 }} />
        </Box>
        {/* Skeleton cards */}
        <Box sx={{ px: 3, pt: 2 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {[1, 2, 3, 4].map((n) => (
              <Box key={n} sx={{ width: { xs: "100%", sm: "calc(50% - 6px)" }, background: "#fff", borderRadius: "12px", border: "0.5px solid #EBEBEB", overflow: "hidden" }}>
                <Box sx={{ height: 90, background: "#F5F5F5" }} />
                <Box sx={{ p: 1.75 }}>
                  <Box sx={{ height: 10, width: "40%", background: "#F0F0F0", borderRadius: 1, mb: 1 }} />
                  <Box sx={{ height: 14, width: "85%", background: "#F0F0F0", borderRadius: 1, mb: 0.75 }} />
                  <Box sx={{ height: 12, width: "70%", background: "#F0F0F0", borderRadius: 1 }} />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* ── Search header ── */}
      <Box sx={{ background: "#fff", borderBottom: "0.5px solid #EBEBEB", px: 3, pt: 2.5, pb: 0 }}>
        <Typography variant="h5" sx={{ mb: 0.5 }}>
          Skills that bring neighbors together
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Find a neighbor who can help — or offer what you're great at
        </Typography>

        {/* Airbnb pill search */}
        <Box sx={{ display: "flex", gap: 1.5, mb: 2 }}>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              background: "#fff",
              border: "1.5px solid #222",
              borderRadius: "40px",
              padding: "8px 16px",
              gap: 1,
            }}
          >
            <SearchIcon sx={{ fontSize: 18, color: "#717171" }} />
            <Box
              component="input"
              placeholder="Search skills or neighbors..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
              sx={{
                flex: 1,
                border: "none",
                outline: "none",
                fontSize: 13,
                color: "#222",
                background: "transparent",
                fontFamily: "inherit",
                "&::placeholder": { color: "#717171" },
              }}
            />
          </Box>
          <Button
            variant="outlined"
            startIcon={<TuneIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: "#DDDDDD",
              color: "#222",
              fontWeight: 500,
              fontSize: 13,
              borderRadius: "40px",
              px: 2,
              "&:hover": { borderColor: "#222", background: "#F7F7F7" },
            }}
          >
            Filters
          </Button>
          {/* {isAuthenticated && (
            <Button
              variant="contained"
              onClick={() => navigate("/listings/create")}
              sx={{ borderRadius: "40px", px: 2.5, whiteSpace: "nowrap", fontSize: 13 }}
            >
              Offer a skill
            </Button>
          )} */}
        </Box>

        {/* Airbnb-style category icon row */}
        <Box sx={{ display: "flex", gap: 0, overflowX: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
          {ALL_CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            const icon = CATEGORY_ICONS[cat] ?? "🤝";
            const label = cat === "All" ? "All" : cat === "Home & Garden" ? "Gardening" : cat === "Education" ? "Tutoring" : cat;
            return (
              <Box
                key={cat}
                onClick={() => setActiveCategory(cat)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "5px",
                  padding: "12px 16px",
                  cursor: "pointer",
                  borderBottom: active ? "2px solid #222" : "2px solid transparent",
                  color: active ? "#222" : "#717171",
                  transition: "all .15s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  "&:hover": { color: "#222" },
                }}
              >
                <Box sx={{ fontSize: 22, lineHeight: 1 }}>{icon}</Box>
                <Typography sx={{ fontSize: 11, fontWeight: active ? 600 : 400, color: "inherit" }}>
                  {label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── Results bar ── */}
      <Box sx={{ px: 3, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="body2" color="text.secondary">
          {filtered.length} skill{filtered.length !== 1 ? "s" : ""} available
        </Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mx: 3, mb: 2 }}>{error}</Alert>}

      {/* ── Empty states ── */}
      {filtered.length === 0 && !error && (
        <Box sx={{ textAlign: "center", py: 8, px: 3 }}>
          <Typography sx={{ fontSize: 48, mb: 2 }}>
            {search || activeCategory !== "All" ? "🔍" : "🏘️"}
          </Typography>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {search || activeCategory !== "All"
              ? `No results for "${search || activeCategory}"`
              : "Your neighborhood is waiting"}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320, mx: "auto" }}>
            {search || activeCategory !== "All"
              ? "Try a different keyword or category."
              : "No skills listed yet. Be the first to offer yours."}
          </Typography>
          {isAuthenticated && (
            <Button variant="contained" onClick={() => navigate("/listings/create")} sx={{ borderRadius: "40px" }}>
              Offer your first skill
            </Button>
          )}
        </Box>
      )}

      {/* ── Cards grid — equal width AND height ── */}
      <Box sx={{ px: 3, pb: 4 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",                        // 1 column on mobile
              sm: "repeat(2, 1fr)",             // 2 equal columns on tablet
              md: "repeat(3, 1fr)",             // 3 equal columns on desktop
            },
            gap: "14px",
            alignItems: "stretch",             // all cells same height
          }}
        >
          {filtered.map((listing) => (
            <SkillCard
              key={listing.id}
              listing={listing}
              onViewDetails={() => console.log("View details:", listing.id)}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}