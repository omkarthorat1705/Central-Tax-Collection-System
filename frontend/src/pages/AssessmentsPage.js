import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AdminLayout from "../layouts/AdminLayout";
import AdminSidebar from "../components/AdminSidebar";
import EnterpriseSectionCard from "../components/enterprise/EnterpriseSectionCard";
import API from "../api/api";

const AssessmentsPage = () => {
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState("");
  const [financialYear, setFinancialYear] = useState("2026-2027");
  const [generatedAssessments, setGeneratedAssessments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const { assetId } = useParams();

  const loadAssets = async () => {
    try {
      const response = await API.get("/getAssets");
      setAssets(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/getAssessments");
      setGeneratedAssessments(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
    loadAssessments();
  }, []);

  useEffect(() => {
    if (assetId) {
      setSelectedAsset(assetId);
    }
  }, [assetId]);

  const generateAssessment = async () => {
    if (!selectedAsset) {
      alert("Please select an asset first.");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/generateAssessment", {
        asset_id: selectedAsset,
        financial_year: financialYear,
      });
      await loadAssessments();
      setSelectedAsset("");
      alert("Assessment generated successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to generate assessment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Assessments">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Assessment Management
          </Typography>
          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Generate and review assessments for registered assets.
          </Typography>
        </Box>

        <EnterpriseSectionCard title="Generate Assessment" subtitle="Create a fresh assessment for an asset and financial year.">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Asset *"
                value={selectedAsset}
                onChange={(event) => setSelectedAsset(event.target.value)}
              >
                {assets.map((asset) => (
                  <MenuItem key={asset.id} value={asset.id}>
                    {asset.asset_code || asset.id} - {asset.asset_name || "Unnamed Asset"}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Financial Year"
                value={financialYear}
                onChange={(event) => setFinancialYear(event.target.value)}
              >
                <MenuItem value="2025-2026">2025-2026</MenuItem>
                <MenuItem value="2026-2027">2026-2027</MenuItem>
                <MenuItem value="2027-2028">2027-2028</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={generateAssessment}
              disabled={submitting}
            >
              {submitting ? "Generating..." : "Generate Assessment"}
            </Button>
          </Box>
        </EnterpriseSectionCard>

        <EnterpriseSectionCard title="Assessment Ledger" subtitle="Recent assessments created across the system.">
          <Grid container spacing={2}>
            {loading ? (
              <Grid size={12}>
                <Typography color="text.secondary">Loading assessments...</Typography>
              </Grid>
            ) : generatedAssessments.length === 0 ? (
              <Grid size={12}>
                <Typography color="text.secondary">No assessments found yet.</Typography>
              </Grid>
            ) : (
              generatedAssessments.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <Box
                    sx={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 3,
                      p: 2.5,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                      <Box>
                        <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                          {item.assessment_number || `ASM-${item.id}`}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}>
                          {item.asset_name || item.asset_code || "Asset"} • {item.financial_year || "—"}
                        </Typography>
                      </Box>
                      <Chip label={item.assessment_status || "GENERATED"} color="success" size="small" />
                    </Box>

                    <Typography sx={{ color: "#94a3b8", mt: 2 }}>
                      Tax: {item.tax_name || "—"}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8" }}>
                      Citizen: {item.citizen_name || "—"}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8" }}>
                      Calculated: ₹{Number(item.calculated_amount || 0).toFixed(2)} • Arrears: ₹{Number(item.arrears_amount || 0).toFixed(2)}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8" }}>
                      Total: ₹{Number(item.total_amount || 0).toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </EnterpriseSectionCard>
      </Box>
    </AdminLayout>
  );
};

export default AssessmentsPage;
