export interface CategoryConfig {
  label: string;
  emoji: string;
  iconBg: string;
  iconColor: string;
  catColor: string;
  cardBg: string;
}

export const CATEGORY_CONFIG: Record<string, CategoryConfig> = {
  "Education": {
    label: "Tutoring",
    emoji: "📚",
    iconBg: "#FEF3C7",
    iconColor: "#92400E",
    catColor: "#92400E",
    cardBg: "#FFFBEB",
  },
  "Home & Garden": {
    label: "Gardening",
    emoji: "🌿",
    iconBg: "#D8F3DC",
    iconColor: "#1B4332",
    catColor: "#2D6A4F",
    cardBg: "#F0FFF4",
  },
  "Tech": {
    label: "Tech help",
    emoji: "💻",
    iconBg: "#DBEAFE",
    iconColor: "#1E40AF",
    catColor: "#1E40AF",
    cardBg: "#EFF6FF",
  },
  "Childcare": {
    label: "Childcare",
    emoji: "👶",
    iconBg: "#FCE7F3",
    iconColor: "#9D174D",
    catColor: "#9D174D",
    cardBg: "#FFF0F6",
  },
  "Food": {
    label: "Cooking",
    emoji: "🍳",
    iconBg: "#FEF9C3",
    iconColor: "#854D0E",
    catColor: "#854D0E",
    cardBg: "#FEFCE8",
  },
  "Transport": {
    label: "Transport",
    emoji: "🚗",
    iconBg: "#EDE9FE",
    iconColor: "#5B21B6",
    catColor: "#5B21B6",
    cardBg: "#F5F3FF",
  },
  "Other": {
    label: "Other",
    emoji: "🤝",
    iconBg: "#F3F4F6",
    iconColor: "#374151",
    catColor: "#374151",
    cardBg: "#F9FAFB",
  },
};

export const getCategoryConfig = (category: string): CategoryConfig =>
  CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG["Other"];

export const ALL_CATEGORIES = ["All", ...Object.keys(CATEGORY_CONFIG)];