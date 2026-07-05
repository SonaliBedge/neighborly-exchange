import { Box, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HOW_IT_WORKS = [
  {
    icon: "🙋",
    iconBg: "#FFF0F0",
    title: "Offer a skill",
    subtitle: "List what you can help with",
  },
  {
    icon: "🤝",
    iconBg: "#F0FFF4",
    title: "Get matched",
    subtitle: "Connect with a neighbor",
  },
  {
    icon: "⭐",
    iconBg: "#FFFBEB",
    title: "Build trust",
    subtitle: "Earn your reputation",
  },
];

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  return (
    <Box sx={{ background: "#F7F7F7", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <Box
        sx={{
          background: "#FFFFFF",
          borderBottom: "0.5px solid #EBEBEB",
          px: { xs: 3, md: 6 },
          py: { xs: 5, md: 7 },
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background watermark */}
        <Box
          sx={{
            position: "absolute",
            right: { xs: -20, md: 60 },
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: { xs: 120, md: 180 },
            opacity: 0.05,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          🏘️
        </Box>

        {/* Location tag */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.75,
            background: "#FFF0F0",
            color: "#FF5A5F",
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: "0.3px",
            padding: "4px 12px",
            borderRadius: "20px",
            mb: 2,
          }}
        >
          📍 Your neighborhood
        </Box>

        {/* Title */}
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 28, md: 38 },
            fontWeight: 800,
            color: "#222",
            lineHeight: 1.1,
            letterSpacing: "-0.8px",
            mb: 1.5,
            maxWidth: 480,
          }}
        >
          Skills that bring{" "}
          <Box component="span" sx={{ color: "#FF5A5F" }}>
            neighbors
          </Box>{" "}
          together.
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="body1"
          sx={{
            color: "#717171",
            lineHeight: 1.75,
            mb: 3.5,
            maxWidth: 400,
            fontSize: 14,
          }}
        >
          Find someone who can help — or offer what you're great at.
          No money, just community.
        </Typography>

        {/* CTA buttons */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/listings")}
            sx={{ borderRadius: "40px", px: 3, fontSize: 14 }}
          >
            Browse skills
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate(isAuthenticated ? "/listings/create" : "/register")}
            sx={{
              borderRadius: "40px",
              px: 3,
              fontSize: 14,
              borderColor: "#DDDDDD",
              color: "#222",
              "&:hover": { borderColor: "#222", background: "#F7F7F7" },
            }}
          >
            {isAuthenticated ? "Offer a skill" : "Join your neighborhood"}
          </Button>
        </Box>

        {/* Trust pills */}
        <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
          {[
            { icon: "👥", value: "248", label: "neighbors" },
            { icon: "🤝", value: "412", label: "exchanges" },
            { icon: "⭐", value: "4.9", label: "avg rating" },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                background: "#F7F7F7",
                border: "0.5px solid #EBEBEB",
                borderRadius: "20px",
                px: 1.5,
                py: 0.6,
              }}
            >
              <Box sx={{ fontSize: 14 }}>{item.icon}</Box>
              <Typography sx={{ fontSize: 12, color: "#717171" }}>
                <Box component="span" sx={{ fontWeight: 700, color: "#222" }}>
                  {item.value}
                </Box>{" "}
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── How it works ── */}
      <Box
        sx={{
          background: "#FFFFFF",
          borderBottom: "0.5px solid #EBEBEB",
          px: { xs: 3, md: 6 },
          py: { xs: 4, md: 5 },
          mt: 2,
        }}
      >
        {/* Section header */}
        <Box sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "1px",
              color: "#FF5A5F",
              mb: 0.75,
            }}
          >
            HOW IT WORKS
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "#222", letterSpacing: "-0.3px" }}
          >
            Simple as 1, 2, 3
          </Typography>
        </Box>

        {/* Three steps */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: { xs: 3, md: 4 },
          }}
        >
          {HOW_IT_WORKS.map((step, index) => (
            <Box
              key={step.title}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: { xs: "flex-start", sm: "center" },
                textAlign: { xs: "left", sm: "center" },
                position: "relative",
              }}
            >
              {/* Connector line between steps (desktop only) */}
              {index < HOW_IT_WORKS.length - 1 && (
                <Box
                  sx={{
                    display: { xs: "none", sm: "block" },
                    position: "absolute",
                    top: 28,
                    left: "calc(50% + 32px)",
                    width: "calc(100% - 8px)",
                    height: "1px",
                    background: "#EBEBEB",
                    zIndex: 0,
                  }}
                />
              )}

              {/* Icon */}
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: "16px",
                  background: step.iconBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  mb: 2,
                  border: "0.5px solid rgba(0,0,0,0.06)",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                {step.icon}
              </Box>

              {/* Step number */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  mb: 0.75,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#222",
                    color: "white",
                    fontSize: 10,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {index + 1}
                </Box>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#222",
                    letterSpacing: "-0.2px",
                  }}
                >
                  {step.title}
                </Typography>
              </Box>

              {/* Subtitle */}
              <Typography
                variant="body2"
                sx={{
                  color: "#717171",
                  lineHeight: 1.6,
                  fontSize: 13,
                }}
              >
                {step.subtitle}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* CTA below steps */}
        <Box
          sx={{
            mt: 5,
            pt: 4,
            borderTop: "0.5px solid #EBEBEB",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 15, fontWeight: 700, color: "#222", mb: 0.5 }}>
              Ready to get started?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join hundreds of neighbors already exchanging skills.
            </Typography>
          </Box>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate(isAuthenticated ? "/listings/create" : "/register")}
            sx={{ borderRadius: "40px", px: 4, fontSize: 14, whiteSpace: "nowrap" }}
          >
            {isAuthenticated ? `Welcome back, ${user?.firstName} 👋` : "Get started — it's free"}
          </Button>
        </Box>
      </Box>

    </Box>
  );
}