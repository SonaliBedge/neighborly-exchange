import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FF5A5F",
      dark: "#E0484D",
      light: "#FFF0F0",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#222222",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F7F7F7",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#222222",
      secondary: "#717171",
    },
    divider: "#EBEBEB",
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontWeight: 800, letterSpacing: "-0.8px" },
    h2: { fontWeight: 700, letterSpacing: "-0.5px" },
    h3: { fontWeight: 700, letterSpacing: "-0.4px" },
    h5: { fontWeight: 700, letterSpacing: "-0.3px" },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          padding: "10px 20px",
          fontSize: 14,
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        contained: {
          "&:hover": { opacity: 0.92 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "none",
          border: "0.5px solid #EBEBEB",
          transition: "box-shadow 0.2s ease, border-color 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
            borderColor: "#D0D0D0",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            "& fieldset": { borderColor: "#DDDDDD" },
            "&:hover fieldset": { borderColor: "#222222" },
            "&.Mui-focused fieldset": { borderColor: "#222222", borderWidth: 1.5 },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#222222",
          boxShadow: "none",
          borderBottom: "0.5px solid #EBEBEB",
        },
      },
    },
  },
});

export default theme;