import { useEffect, useState } from "react";
import {
  Box, Button, Card, CardContent, Chip,
  CircularProgress, Typography, Alert
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getListings } from "../api/listings";
import type { ListingResponse } from "../types/listings";
import { useAuth } from "../context/AuthContext";

export default function Listings() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Skills Available in Your Neighborhood
        </Typography>
        {isAuthenticated && (
          <Button variant="contained" onClick={() => navigate("/listings/create")}>
            Offer a Skill
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Empty State */}
      {listings.length === 0 && !error && (
        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No listings yet — be the first to offer a skill!
          </Typography>
          {isAuthenticated && (
            <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/listings/create")}>
              Offer a Skill
            </Button>
          )}
        </Box>
      )}

      {/* Listing Cards */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {listings.map((listing) => (
          <Box key={listing.id} sx={{ width: { xs: "100%", sm: "calc(50% - 12px)" } }}>
            <Card variant="outlined" sx={{ height: "100%", borderRadius: 2 }}>
              <CardContent>

                {/* Category chip + skill name */}
                <Box sx={{ display: "flex", gap: 1, mb: 1, flexWrap: "wrap" }}>
                  <Chip
                    label={listing.skillCategory}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  <Chip
                    label={listing.skillName}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                {/* Title */}
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  {listing.title}
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {listing.description}
                </Typography>

                {/* Availability */}
                {listing.availability && (
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    🕐 {listing.availability}
                  </Typography>
                )}

                {/* Offered by */}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Offered by{" "}
                    <strong>{listing.userFirstName} {listing.userLastName}</strong>
                  </Typography>
                  {listing.userReputationScore > 0 && (
                    <Typography variant="body2" color="warning.main">
                      ★ {listing.userReputationScore.toFixed(1)}
                    </Typography>
                  )}
                </Box>

              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>

    </Box>
  );
}