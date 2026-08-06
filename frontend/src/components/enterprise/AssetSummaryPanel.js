import {
  Box,
  Typography,
  LinearProgress,
  Divider,
  Stack,
  Chip,
} from "@mui/material";

export default function AssetSummaryPanel({
  progress,
  assetName,
  assetType,
  citizen,
  selectedTaxes = [],
  parameterCount = 0,
  currentStep,
}) {

  const color =
    progress < 40
      ? "#ef4444"
      : progress < 80
      ? "#f59e0b"
      : "#22c55e";

  return (
    <Box
      sx={{
        background: "#16233d",
        borderRadius: 4,
        border: "1px solid rgba(255,255,255,.08)",
        p:3,
        position:"sticky",
        top:20
      }}
    >

      <Typography
        variant="h6"
        color="white"
        fontWeight={700}
        mb={3}
      >
        Asset Registration Summary
      </Typography>

      <Typography color="#94a3b8">
        Completion
      </Typography>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          mt:1,
          mb:1,
          height:8,
          borderRadius:10,
          "& .MuiLinearProgress-bar":{
            background:color
          }
        }}
      />

      <Typography
        sx={{
          color,
          fontWeight:700,
          mb:3
        }}
      >
        {progress.toFixed(0)}% Completed
      </Typography>

      <Divider sx={{mb:3}}/>

      <Stack spacing={2}>

        <Summary
          label="Asset Name"
          value={assetName || "Not Entered"}
        />

        <Summary
          label="Asset Type"
          value={assetType || "Not Selected"}
        />

        <Summary
          label="Citizen"
          value={citizen || "Not Selected"}
        />

        <Summary
          label="Taxes"
          value={selectedTaxes.length}
        />

        <Summary
          label="Parameters"
          value={parameterCount}
        />

        <Summary
          label="Current Step"
          value={currentStep}
        />

      </Stack>

      <Divider sx={{my:3}}/>

      <Chip
        label="DRAFT"
        color="warning"
      />

    </Box>
  );
}

function Summary({label,value}){

  return(
    <Box>
      <Typography
        color="#94a3b8"
        fontSize={12}
      >
        {label}
      </Typography>

      <Typography
        color="white"
        fontWeight={600}
      >
        {value}
      </Typography>
    </Box>
  )
}