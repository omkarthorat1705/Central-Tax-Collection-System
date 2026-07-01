import {
  Box,
  Typography,
  LinearProgress,
  Divider,
  Chip,
  Stack,
} from "@mui/material";

export default function EnterpriseSummaryPanel({
  progress = 0,
  citizenCode = "AUTO GENERATED",
  status = "ACTIVE",
  verification = "PENDING",
  fullName = "",
  mobile = "",
  city = "",
  citizenType = "INDIVIDUAL",
}) {
  const completionColor =
    progress < 40 ? "#ef4444" : progress < 80 ? "#f59e0b" : "#22c55e";

  return (
    <Box
      sx={{
        background: "linear-gradient(180deg,#0f1d37 0%,#091425 100%)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: "24px",
        p: 3,
        position: "sticky",
        top: 20,
        boxShadow: "0 20px 50px rgba(0,0,0,.25)",
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 700,
          fontSize: "1.15rem",
          mb: 3,
        }}
      >
        Citizen Registration Summary
      </Typography>

      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: ".85rem",
          mb: 1,
        }}
      >
        Profile Completion
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 999,
          mb: 1,

          "& .MuiLinearProgress-bar": {
            background: completionColor,
          },
        }}
      />

      <Typography
        sx={{
          color: completionColor,
          fontWeight: 700,
          mb: 3,
        }}
      >
        {progress.toFixed(0)}% Completed
      </Typography>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
          mb: 3,
        }}
      />

      <Stack spacing={2}>
        <Box>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Citizen Code
          </Typography>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
            }}
          >
            {citizenCode}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Citizen Name
          </Typography>

          <Typography
            sx={{
              color: "#fff",
            }}
          >
            {fullName || "Not Entered"}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Mobile Number
          </Typography>

          <Typography
            sx={{
              color: "#fff",
            }}
          >
            {mobile || "Not Entered"}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            City
          </Typography>

          <Typography
            sx={{
              color: "#fff",
            }}
          >
            {city || "Not Entered"}
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: 12,
            }}
          >
            Citizen Type
          </Typography>

          <Typography
            sx={{
              color: "#fff",
            }}
          >
            {citizenType}
          </Typography>
        </Box>
      </Stack>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
          my: 3,
        }}
      />

      <Stack
        direction="row"
        spacing={1}
        sx={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        <Chip label={status} color="success" size="small" />

        <Chip label={verification} color="warning" size="small" />
      </Stack>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,.08)",
          my: 3,
        }}
      />

      <Typography
        sx={{
          color: "#fff",
          fontWeight: 700,
          mb: 2,
        }}
      >
        Validation Checklist
      </Typography>

      <Typography
        sx={{
          color: fullName ? "#22c55e" : "#ef4444",
          mb: 1,
        }}
      >
        {fullName ? "✓" : "✗"} Personal Information
      </Typography>

      <Typography
        sx={{
          color: mobile ? "#22c55e" : "#ef4444",
          mb: 1,
        }}
      >
        {mobile ? "✓" : "✗"} Contact Information
      </Typography>

      <Typography
        sx={{
          color: city ? "#22c55e" : "#ef4444",
        }}
      >
        {city ? "✓" : "✗"} Address Information
      </Typography>
    </Box>
  );
}
