import { useEffect, useState } from "react";
import {
  getRevenueSummary,
  getWardWiseCollection,
  getTaxWiseCollection,
} from "../services/dashboardService";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Divider,
  Stack,
  Chip,
} from "@mui/material";

import {
  People,
  Assessment,
  AccountBalance,
  Payments,
} from "@mui/icons-material";

import AdminLayout from "../layouts/AdminLayout";
import AdminSidebar from "../components/AdminSidebar";

import { useAppData } from "../context/AppDataContext";
// import LogoutIcon from "@mui/icons-material/Logout";
// import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
// import { getCurrentUser } from "../utils/auth";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#14B8A6",
  "#F97316",
];

const calculateCollectionEfficiency = (summary) => {
  const total =
    Number(summary.total_collection || 0) + Number(summary.total_pending || 0);

  if (!total) return 0;

  return ((summary.total_collection / total) * 100).toFixed(1);
};

const averageAssessment = (summary) => {
  if (!summary.total_assessments) return 0;

  return Number(summary.total_pending || 0) / Number(summary.total_assessments);
};

const AdminDashboard = () => {
  const {
    citizens = [],
    assetTypes = [],
    taxTypes = [],
    loading,
  } = useAppData();

  const navigate = useNavigate();

  const [dashboardSummary, setDashboardSummary] = useState({
    total_assessments: 0,
    total_collection: 0,
    total_pending: 0,
    total_citizens: 0,
    total_assets: 0,
    partial_cases: 0,
  });

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [wardCollection, setWardCollection] = useState([]);

  const [taxCollection, setTaxCollection] = useState([]);

  const cards = [
    {
      title: "Assessments",
      value: dashboardSummary.total_assessments,
      icon: <Assessment sx={{ fontSize: 38 }} />,
      color: "#3B82F6",
      subtitle: "Generated",
    },
    {
      title: "Revenue",
      value: formatCurrency(dashboardSummary.total_collection),
      icon: <Payments sx={{ fontSize: 38 }} />,
      color: "#10B981",
      subtitle: "Collected",
    },
    {
      title: "Pending",
      value: formatCurrency(dashboardSummary.total_pending),
      icon: <AccountBalance sx={{ fontSize: 38 }} />,
      color: "#F59E0B",
      subtitle: "Outstanding",
    },
    {
      title: "Citizens",
      value: dashboardSummary.total_citizens,
      icon: <People sx={{ fontSize: 38 }} />,
      color: "#8B5CF6",
      subtitle: "Registered",
    },
  ];

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [summary, ward, tax] = await Promise.all([
          getRevenueSummary(),
          getWardWiseCollection(),
          getTaxWiseCollection(),
        ]);

        setDashboardSummary({
          total_assessments: Number(summary.total_assessments || 0),
          total_collection: Number(summary.total_collection || 0),
          total_pending: Number(summary.total_pending || 0),
          total_citizens: Number(summary.total_citizens || 0),
          total_assets: Number(summary.total_assets || 0),
          partial_cases: Number(summary.partial_cases || 0),
        });
        setWardCollection(ward);

        setTaxCollection(tax);
      } catch (err) {
        console.error(err);
      } finally {
        setDashboardLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading || dashboardLoading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#0f172a",
        }}
      >
        {" "}
        <CircularProgress />{" "}
      </Box>
    );
  }

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Dashboard">
      <Box
        sx={{
          mb: 5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} color="white">
            CTCS Enterprise Dashboard
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              mt: 1,
            }}
          >
            Centralized Municipal Revenue Management System
          </Typography>
        </Box>

        <Chip
          label="LIVE"
          color="success"
          sx={{
            fontWeight: 700,
            px: 2,
          }}
        />
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.title} xs={12} md={6} lg={3}>
            <Card
              sx={{
                borderRadius: 4,
                background: "linear-gradient(145deg,#17263f,#132238)",
                color: "white",
                border: "1px solid rgba(255,255,255,.05)",
                transition: ".25s",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 15px 35px rgba(0,0,0,.25)",
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography color="#94A3B8" variant="body2">
                      {card.title}
                    </Typography>

                    <Typography variant="h4" fontWeight={700} mt={1}>
                      {card.value}
                    </Typography>

                    <Typography color="#64748B" variant="caption">
                      {card.subtitle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 62,
                      height: 62,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: `${card.color}20`,
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} lg={8}>
          <Card
            sx={{
              background: "#16233d",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={700} color="white" mb={3}>
                Revenue Analytics
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography color="#94A3B8" mb={2}>
                    Collection by Tax Type
                  </Typography>

                  <Box
                    sx={{
                      height: 300,
                    }}
                  >
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={taxCollection}
                          dataKey="amount"
                          nameKey="tax_name"
                          innerRadius={65}
                          outerRadius={105}
                          paddingAngle={2}
                        >
                          {taxCollection.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>

                        <Tooltip formatter={(v) => formatCurrency(v)} />

                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography color="#94A3B8" mb={2}>
                    Collection by Ward
                  </Typography>

                  <Box
                    sx={{
                      height: 300,
                    }}
                  >
                    <ResponsiveContainer>
                      <BarChart
                        data={wardCollection}
                        margin={{
                          top: 10,
                          right: 10,
                          left: 0,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />

                        <XAxis dataKey="ward_name" stroke="#94A3B8" />

                        <YAxis
                          stroke="#94A3B8"
                          tickFormatter={(v) => `${Math.round(v / 1000)}K`}
                        />

                        <Tooltip formatter={(v) => formatCurrency(v)} />

                        <Bar
                          dataKey="amount"
                          radius={[8, 8, 0, 0]}
                          fill="#3B82F6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Grid>
              </Grid>

              <Divider
                sx={{
                  my: 4,
                  borderColor: "rgba(255,255,255,.08)",
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6} md={3}>
                  <Typography color="#64748B">Collection Efficiency</Typography>

                  <Typography variant="h5" fontWeight={700} color="#22c55e">
                    {calculateCollectionEfficiency(dashboardSummary)}%
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography color="#64748B">Average Assessment</Typography>

                  <Typography variant="h5" fontWeight={700} color="white">
                    {formatCurrency(averageAssessment(dashboardSummary))}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography color="#64748B">Partial Payments</Typography>

                  <Typography variant="h5" fontWeight={700} color="#f59e0b">
                    {dashboardSummary.partial_cases}
                  </Typography>
                </Grid>

                <Grid item xs={6} md={3}>
                  <Typography color="#64748B">Assets</Typography>

                  <Typography variant="h5" fontWeight={700} color="#60a5fa">
                    {dashboardSummary.total_assets}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              height: "100%",
              background: "#16233d",
              borderRadius: 4,
              border: "1px solid rgba(255,255,255,.05)",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight={700} color="white" mb={3}>
                Live System Insights
              </Typography>

              <Stack spacing={2.2}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Collection Efficiency</Typography>

                  <Typography fontWeight={700} color="#22C55E">
                    {calculateCollectionEfficiency(dashboardSummary)}%
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Revenue Collected</Typography>

                  <Typography fontWeight={700} color="white">
                    {formatCurrency(dashboardSummary.total_collection)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Pending Revenue</Typography>

                  <Typography fontWeight={700} color="#f59e0b">
                    {formatCurrency(dashboardSummary.total_pending)}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Assessments</Typography>

                  <Typography fontWeight={700} color="white">
                    {dashboardSummary.total_assessments}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Registered Citizens</Typography>

                  <Typography fontWeight={700} color="white">
                    {dashboardSummary.total_citizens}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Assets</Typography>

                  <Typography fontWeight={700} color="white">
                    {dashboardSummary.total_assets}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Partial Payments</Typography>

                  <Typography fontWeight={700} color="#3B82F6">
                    {dashboardSummary.partial_cases}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "#23324b" }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography color="#94A3B8">Average Assessment</Typography>

                  <Typography fontWeight={700} color="white">
                    {formatCurrency(averageAssessment(dashboardSummary))}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboard;
