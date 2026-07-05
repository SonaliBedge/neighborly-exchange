import { Box, Button, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import type { ListingResponse } from "../types/listings";
import { getCategoryConfig } from "../types/categories";

interface Props {
  listing: ListingResponse;
  onViewDetails?: () => void;
}

const initials = (first: string, last: string) =>
  `${first?.[0] ?? ""}${last?.[0] ?? ""}`.toUpperCase();

export default function SkillCard({ listing, onViewDetails }: Props) {
  const config = getCategoryConfig(listing.skillCategory);

  return (
    <Box
      sx={{
        background: "#FFFFFF",
        borderRadius: "12px",
        border: "0.5px solid #EBEBEB",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        width: "100%",           // fills parent width exactly
        height: "100%",          // fills parent height exactly
        transition: "box-shadow 0.2s ease, border-color 0.2s ease",
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
          borderColor: "#D0D0D0",
        },
      }}
    >

      {/* ── Header: icon + category + title ── */}
      <Box
        sx={{
          background: config.cardBg,
          px: 2,
          py: 1.75,
          borderBottom: "0.5px solid #EBEBEB",
          position: "relative",
        }}
      >
        {/* Rating badge — absolute top right */}
        {listing.userReputationScore > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              display: "flex",
              alignItems: "center",
              gap: "3px",
              background: "#FFFFFF",
              border: "0.5px solid #EBEBEB",
              borderRadius: "6px",
              padding: "3px 7px",
            }}
          >
            <StarIcon sx={{ fontSize: 11, color: "#FFBE00" }} />
            <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#222" }}>
              {listing.userReputationScore.toFixed(1)}
            </Typography>
          </Box>
        )}

        {/* Icon left, category + title stacked right */}
        <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>

        {/* Icon — taller to span both lines */}
        <Box
            sx={{
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: config.iconBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 26,
            border: "0.5px solid rgba(0,0,0,0.06)",
            flexShrink: 0,
            }}
        >
            {config.emoji}
        </Box>

        {/* Category + title stacked, aligned to icon */}
        <Box sx={{ flex: 1, minWidth: 0, pr: listing.userReputationScore > 0 ? 5 : 0 }}>
            <Typography
            sx={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.6px",
                color: config.catColor,
                mb: 0.4,
                lineHeight: 1,
            }}
            >
            {listing.skillCategory.toUpperCase()}
            </Typography>
            <Typography
            sx={{
                fontSize: 13,
                fontWeight: 700,
                color: "#222222",
                lineHeight: 1.35,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
            }}
            >
            {listing.title}
            </Typography>
        </Box>

        </Box>
      </Box>

      {/* ── Body — flex grows to fill space ── */}
      <Box
        sx={{
          px: 2,
          pt: 1.5,
          pb: 1,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: 0,
        }}
      >
        {/* Description — always 2 lines */}
        <Typography
          sx={{
            fontSize: 12,
            color: "#717171",
            lineHeight: 1.6,
            mb: 1.25,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {listing.description}
        </Typography>

        {/* Spacer pushes metadata to bottom of body */}
        <Box sx={{ flex: 1 }} />

        {/* Looking for */}
        {listing.lookingFor && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              background: "#F7F7F7",
              borderRadius: "6px",
              padding: "4px 8px",
              mb: 0.75,
              overflow: "hidden",
            }}
          >
            <SwapHorizIcon sx={{ fontSize: 13, color: "#FF5A5F", flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: 11,
                color: "#717171",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Looking for {listing.lookingFor}
            </Typography>
          </Box>
        )}

        {/* Availability */}
        {listing.availability && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <AccessTimeIcon sx={{ fontSize: 13, color: "#717171", flexShrink: 0 }} />
            <Typography
              sx={{
                fontSize: 11,
                color: "#717171",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {listing.availability}
            </Typography>
          </Box>
        )}
      </Box>

      {/* ── Footer — always pinned to bottom ── */}
      <Box
        sx={{
          px: 2,
          pb: 1.75,
          pt: 1.25,
          borderTop: "0.5px solid #EBEBEB",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0, flex: 1 }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              background: config.iconBg,
              color: config.iconColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 9,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials(listing.userFirstName, listing.userLastName)}
          </Box>
          <Typography
            sx={{
              fontSize: 12,
              color: "#717171",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {listing.userFirstName} {listing.userLastName}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails?.();
          }}
          sx={{
            fontSize: 11,
            fontWeight: 600,
            borderRadius: "20px",
            borderColor: "#222",
            color: "#222",
            py: 0.4,
            px: 1.5,
            flexShrink: 0,
            ml: 1,
            "&:hover": { background: "#222", color: "#fff", borderColor: "#222" },
          }}
        >
          View details
        </Button>
      </Box>
    </Box>
  );
}