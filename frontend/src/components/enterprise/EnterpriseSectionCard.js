import { Box, Typography } from "@mui/material";

export default function EnterpriseSectionCard({ title, subtitle, children }) {
  return (
    <Box
      sx={{
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

        border: "1px solid rgba(255,255,255,0.08)",

        borderRadius: "24px",

        backdropFilter: "blur(18px)",

        p: 4,
      }}
    >
      <Typography
        sx={{
          color: "white",
          fontWeight: 700,
          fontSize: "1.2rem",
        }}
      >
        {title}
      </Typography>

      {subtitle && (
        <Typography
          sx={{
            color: "#94a3b8",
            mt: 0.5,
            mb: 4,
          }}
        >
          {subtitle}
        </Typography>
      )}

      {children}
    </Box>
  );
}
