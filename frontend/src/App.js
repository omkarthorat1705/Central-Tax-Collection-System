import { useMemo, useState } from "react";

import { ThemeProvider, CssBaseline } from "@mui/material";

import { Toaster } from "react-hot-toast";

import { getTheme } from "./theme/theme";

import AppRoutes from "./routes/AppRoutes";

function App() {
  const [mode, setMode] = useState("dark");

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Toaster position="top-right" />

      <AppRoutes mode={mode} setMode={setMode} />
    </ThemeProvider>
  );
}

export default App;
