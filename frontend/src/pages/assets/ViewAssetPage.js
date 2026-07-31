import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";
import EnterpriseSectionCard from "../../components/enterprise/EnterpriseSectionCard";

import assetService from "../../services/assetService";

function InfoField({ label, value }) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography sx={{ color: "#94a3b8", fontSize: 12, mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ color: "#fff", fontWeight: 600 }}>
        {value || "—"}
      </Typography>
    </Box>
  );
}

export default function ViewAssetPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [assetData, setAssetData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAsset = async () => {
      try {
        const response = await assetService.getAssetById(id);
        setAssetData(response);
      } catch (error) {
        console.error(error);
        alert("Failed to load asset details");
        navigate("/assets");
      } finally {
        setLoading(false);
      }
    };

    loadAsset();
  }, [id, navigate]);

  if (loading) {
    return (
      <AdminLayout sidebar={<AdminSidebar />} pageTitle="Asset Details">
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!assetData?.asset) {
    return (
      <AdminLayout sidebar={<AdminSidebar />} pageTitle="Asset Details">
        <Typography color="error">Asset record not found.</Typography>
      </AdminLayout>
    );
  }

  const asset = assetData.asset;
  const taxes = assetData.taxes || [];
  const parameters = assetData.parameters || [];

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Asset Details">
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate("/assets")}>
          Back
        </Button>

        <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/assets/edit/${id}`)}>
          Edit Asset
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <EnterpriseSectionCard>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="h4" fontWeight={700} color="white">
                  {asset.asset_name}
                </Typography>
                <Typography color="#94a3b8" sx={{ mt: 1 }}>
                  {asset.asset_code}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Chip label={asset.status || "ACTIVE"} color="success" />
                <Chip label={asset.asset_type || "Unclassified"} color="info" />
              </Box>
            </Box>
          </EnterpriseSectionCard>

          <EnterpriseSectionCard title="Asset Information" subtitle="Core registration details">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField label="Asset Name" value={asset.asset_name} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField label="Asset Code" value={asset.asset_code} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField label="Asset Type" value={asset.asset_type} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField label="Status" value={asset.status} />
              </Grid>
              <Grid size={12}>
                <InfoField label="Asset Address" value={asset.asset_address} />
              </Grid>
            </Grid>
          </EnterpriseSectionCard>

          <EnterpriseSectionCard title="Citizen Information" subtitle="Associated citizen record">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField label="Citizen Name" value={asset.full_name || asset.citizen_name} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <InfoField label="Citizen Code" value={asset.citizen_code} />
              </Grid>
            </Grid>
          </EnterpriseSectionCard>

          <EnterpriseSectionCard title="Applied Taxes" subtitle="Tax types mapped to this asset">
            {taxes.length === 0 ? (
              <Typography color="text.secondary">No tax mappings are available for this asset.</Typography>
            ) : (
              <Grid container spacing={2}>
                {taxes.map((tax) => (
                  <Grid size={{ xs: 12, md: 6 }} key={tax.id}>
                    <Box sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                        {tax.tax_name}
                      </Typography>
                      <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}>
                        {tax.tax_code || "Tax Type"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </EnterpriseSectionCard>

          <EnterpriseSectionCard title="Assessment Parameters" subtitle="Captured parameter values for assessment">
            {parameters.length === 0 ? (
              <Typography color="text.secondary">No assessment parameters have been captured.</Typography>
            ) : (
              <Grid container spacing={2}>
                {parameters.map((parameter) => (
                  <Grid size={{ xs: 12, md: 6 }} key={parameter.id || parameter.parameter_id}>
                    <Box sx={{ p: 2, borderRadius: 2, background: "rgba(255,255,255,0.04)" }}>
                      <Typography sx={{ color: "#94a3b8", fontSize: 12, mb: 0.5 }}>
                        {parameter.parameter_name || "Parameter"}
                      </Typography>
                      <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                        {parameter.parameter_value || "—"}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </EnterpriseSectionCard>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <EnterpriseSectionCard title="Quick Summary" subtitle="Registration snapshot">
            <InfoField label="Asset Name" value={asset.asset_name} />
            <InfoField label="Type" value={asset.asset_type} />
            <InfoField label="Citizen" value={asset.full_name || asset.citizen_name} />
            <InfoField label="Taxes Assigned" value={taxes.length} />
            <InfoField label="Parameters Recorded" value={parameters.length} />
          </EnterpriseSectionCard>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
