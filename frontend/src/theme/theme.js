import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,

      primary: {
        main: "#1976d2",
      },

      secondary: {
        main: "#00bcd4",
      },

      background: {
        default: mode === "dark" ? "#0b1120" : "#f4f7fb",
        paper: mode === "dark" ? "#111827" : "#ffffff",
      },
    },

    typography: {
      fontFamily: "'Inter', sans-serif",

      h4: {
        fontWeight: 700,
      },

      h5: {
        fontWeight: 600,
      },

      button: {
        textTransform: "none",
        fontWeight: 600,
      },
    },

    shape: {
      borderRadius: 14,
    },
  });
