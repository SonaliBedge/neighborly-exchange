import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Card, CardContent,
  Chip, CircularProgress, Typography
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMyListings, toggleListing } from "../api/listings";
import type { ListingResponse } from "../types/listings";

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

export default function MyListings() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getMyListings();
        setListings(data);
      } catch {
        setError("Failed to load your listings. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleToggle = async (id: number) => {
    setTogglingId(id);
    try {
      const result = await toggleListing(id);
      setListings((prev) =>
        prev.map((l) => (l.id === id ? { ...l, isActive: result.isActive } : l))
      );
    } catch {
      setError("Failed to update listing. Please try again.");
    } finally {
      setTogglingId(null);
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
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4, px: 2 }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            My listings
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {listings.length} listing{listings.length !== 1 ? "s" : ""} — manage what you offer to neighbors
          </Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate("/listings/create")}>
          Offer a skill
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Empty state */}
      {listings.length === 0 && !error && (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            You haven't offered any skills yet.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/listings/create")}>
            Offer your first skill
          </Button>
        </Box>
      )}

      {/* Listing cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
        {listings.map((listing) => {
          const color = getColor(listing.skillCategory);

          return (
            <Box key={listing.id} sx={{ width: { xs: "100%", sm: "calc(50% - 6px)" } }}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  borderTop: `3px solid ${listing.isActive ? color.border : "#B4B2A9"}`,
                  opacity: listing.isActive ? 1 : 0.65,
                }}
              >
                <CardContent sx={{ pb: "12px !important" }}>

                  {/* Status + category tags */}
                  <Box sx={{ display: "flex", gap: 0.75, mb: 1.25, flexWrap: "wrap", alignItems: "center" }}>
                    <Chip
                      label={listing.isActive ? "Active" : "Paused"}
                      size="small"
                      sx={{
                        fontSize: 11,
                        height: 20,
                        fontWeight: 600,
                        backgroundColor: listing.isActive ? "#E1F5EE" : "#F1EFE8",
                        color: listing.isActive ? "#085041" : "#5F5E5A",
                      }}
                    />
                    <Chip
                      label={listing.skillCategory}
                      size="small"
                      sx={{
                        backgroundColor: color.tagBg,
                        color: color.tagText,
                        fontSize: 11,
                        height: 20,
                      }}
                    />
                  </Box>

                  {/* Title */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, lineHeight: 1.3, mb: 0.75 }}>
                    {listing.title}
                  </Typography>

                  {/* Description */}
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
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🤝 Looking for: <strong>{listing.lookingFor}</strong>
                    </Typography>
                  )}

                  {/* Availability */}
                  {listing.availability && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      🕐 {listing.availability}
                    </Typography>
                  )}

                  {/* Action buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      mt: 1.5,
                      pt: 1.25,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/listings/edit/${listing.id}`)}
                      sx={{ flex: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color={listing.isActive ? "warning" : "success"}
                      disabled={togglingId === listing.id}
                      onClick={() => handleToggle(listing.id)}
                      sx={{ flex: 1 }}
                    >
                      {togglingId === listing.id
                        ? "Updating..."
                        : listing.isActive
                        ? "Pause"
                        : "Reactivate"}
                    </Button>
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