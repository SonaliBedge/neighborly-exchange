import { Box, Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Typography, Divider } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import CategoryIcon from "@mui/icons-material/Category";
import { useNavigate, useLocation } from "react-router-dom";

const DRAWER_WIDTH = 220;

const navItems = [
  { label: "Dashboard",   path: "/admin",          icon: <DashboardIcon /> },
  { label: "Users",       path: "/admin/users",     icon: <PeopleIcon /> },
  { label: "Listings",    path: "/admin/listings",  icon: <ListAltIcon /> },
  { label: "Skills",      path: "/admin/skills",    icon: <CategoryIcon /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            backgroundColor: "#1B3A6B",
            color: "white",
          },
        }}
      >
        {/* Brand */}
        <Box sx={{ p: 2.5, pb: 1.5 }}>
          <Typography variant="subtitle2" sx={{ color: "#93C5FD", fontSize: 11, letterSpacing: 1 }}>
            NEIGHBORLY EXCHANGE
          </Typography>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "bold", mt: 0.25 }}>
            Admin Panel
          </Typography>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 1 }} />

        {/* Nav links */}
        <List dense>
          {navItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    mx: 1,
                    borderRadius: 1,
                    mb: 0.5,
                    backgroundColor: active ? "rgba(255,255,255,0.15)" : "transparent",
                    "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                  }}
                >
                  <ListItemIcon sx={{ color: active ? "white" : "#93C5FD", minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: 14,
                      fontWeight: active ? 600 : 400,
                      color: active ? "white" : "#DBEAFE",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mt: "auto", mb: 1 }} />

        {/* Back to app */}
        <Box sx={{ p: 2 }}>
          <Typography
            variant="body2"
            sx={{ color: "#93C5FD", cursor: "pointer", fontSize: 13, "&:hover": { color: "white" } }}
            onClick={() => navigate("/")}
          >
            ← Back to app
          </Typography>
        </Box>
      </Drawer>

      {/* Main content */}
      <Box sx={{ flexGrow: 1, backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        {children}
      </Box>

    </Box>
  );
}