import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AdminLayout from "../layouts/AdminLayout";
import AdminSidebar from "../components/AdminSidebar";
import API from "../api/api";

const ReportsPage = () => {
  const [summary, setSummary] = useState({
    total_assessment: 0,
    total_collection: 0,
    total_pending: 0,
    partial_cases: 0,
  });
  const [wardCollection, setWardCollection] = useState([]);
  const [taxCollection, setTaxCollection] = useState([]);

  const loadReports = async () => {
    try {
      const summaryResponse = await API.get("/getRevenueSummary");
      setSummary(summaryResponse.data.data || {});

      const wardResponse = await API.get("/getWardWiseCollection");
      setWardCollection(wardResponse.data.data || []);

      const taxResponse = await API.get("/getTaxWiseCollection");
      setTaxCollection(taxResponse.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const statCards = [
    { label: "Total Assessments", value: summary.total_assessment || 0 },
    { label: "Total Collections", value: `₹${Number(summary.total_collection || 0).toFixed(2)}` },
    { label: "Pending Dues", value: `₹${Number(summary.total_pending || 0).toFixed(2)}` },
    { label: "Partial Payments", value: summary.partial_cases || 0 },
  ];

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Reports">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Revenue Analytics & Reports
          </Typography>
          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Track revenue performance across assessments, collections, wards, and tax types.
          </Typography>
        </Box>

        <Grid container spacing={2}>
          {statCards.map((card) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={card.label}>
              <Paper
                sx={{
                  p: 2.5,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                  {card.label}
                </Typography>
                <Typography variant="h5" sx={{ color: "white", fontWeight: 700, mt: 1 }}>
                  {card.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                Ward Wise Collection
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#94a3b8" }}>Ward</TableCell>
                      <TableCell sx={{ color: "#94a3b8" }}>Collection</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {wardCollection.map((item, index) => (
                      <TableRow key={`${item.ward_number || index}`}>
                        <TableCell sx={{ color: "white" }}>{item.ward_number || "—"}</TableCell>
                        <TableCell sx={{ color: "white" }}>₹{Number(item.total_collection || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 2.5, borderRadius: 3, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                Tax Type Collection
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "#94a3b8" }}>Tax Type</TableCell>
                      <TableCell sx={{ color: "#94a3b8" }}>Collection</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {taxCollection.map((item, index) => (
                      <TableRow key={`${item.tax_name || index}`}>
                        <TableCell sx={{ color: "white" }}>{item.tax_name || "—"}</TableCell>
                        <TableCell sx={{ color: "white" }}>₹{Number(item.total_collection || 0).toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </AdminLayout>
  );
};

export default ReportsPage;
