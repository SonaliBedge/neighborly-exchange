import { useEffect, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress,
  Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography
} from "@mui/material";
import { getAdminListings, removeListing } from "../../api/admin";
import type { ListingResponse } from "../../types/listings";
import AdminLayout from "../../components/AdminLayout";

export default function AdminListings() {
  const [listings, setListings] = useState<ListingResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    getAdminListings()
      .then(setListings)
      .catch(() => setError("Failed to load listings."))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (id: number) => {
    if (!window.confirm("Remove this listing? This cannot be undone.")) return;
    setRemovingId(id);
    try {
      await removeListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    } catch {
      setError("Failed to remove listing.");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Listings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {listings.length} total listing{listings.length !== 1 ? "s" : ""} — all statuses
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && <CircularProgress />}

        {!loading && (
          <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#F1F5F9" }}>
                  <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Skill</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Offered by</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Created</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {listings.map((listing) => (
                  <TableRow key={listing.id} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {listing.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary"
                        sx={{ display: "block", maxWidth: 280,
                          overflow: "hidden", textOverflow: "ellipsis",
                          whiteSpace: "nowrap" }}>
                        {listing.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={listing.skillName} size="small"
                        variant="outlined" sx={{ fontSize: 11 }} />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13 }}>
                      {listing.userFirstName} {listing.userLastName}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={listing.isActive ? "Active" : "Paused"}
                        size="small"
                        sx={{
                          fontSize: 11,
                          backgroundColor: listing.isActive ? "#DCFCE7" : "#F1F5F9",
                          color: listing.isActive ? "#166534" : "#64748B",
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontSize: 13, color: "text.secondary" }}>
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        disabled={removingId === listing.id}
                        onClick={() => handleRemove(listing.id)}
                      >
                        {removingId === listing.id ? "..." : "Remove"}
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