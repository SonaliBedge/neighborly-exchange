import { useEffect, useState } from "react";
import { Box, Card, CardContent, CircularProgress,
  Typography, Alert, Divider } from "@mui/material";
import { getStats, type PlatformStats } from "../../api/admin";
import AdminLayout from "../../components/AdminLayout";

interface StatCardProps {
  label: string;
  value: number;
  sub?: string;
  color?: string;
}

function StatCard({ label, value, sub, color = "#1B3A6B" }: StatCardProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2, flex: 1, minWidth: 160 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="caption" color="text.secondary">
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setError("Failed to load stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <Box sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Platform overview at a glance.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {loading && <CircularProgress />}

        {stats && (
          <>
            {/* This week */}
            <Typography variant="overline" color="text.secondary">
              This week
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1, mb: 3 }}>
              <StatCard
                label="New users"
                value={stats.newUsersThisWeek}
                color="#1D9E75"
              />
              <StatCard
                label="New listings"
                value={stats.newListingsThisWeek}
                color="#2563EB"
              />
            </Box>

            <Divider sx={{ mb: 3 }} />

            {/* All time */}
            <Typography variant="overline" color="text.secondary">
              All time
            </Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 1 }}>
              <StatCard label="Total users" value={stats.totalUsers} />
              <StatCard label="Total listings" value={stats.totalListings}
                sub={`${stats.activeListings} active`} />
              <StatCard label="Open requests" value={stats.openRequests} />
              <StatCard label="Completed exchanges" value={stats.completedExchanges}
                color="#1D9E75" />
            </Box>
          </>
        )}
      </Box>
    </AdminLayout>
  );
}