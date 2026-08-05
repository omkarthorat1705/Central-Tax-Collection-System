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
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

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
      title: "Total Assessments",
      value: dashboardSummary.total_assessments,
      icon: <Assessment sx={{ fontSize: 42 }} />,
      color: "#38bdf8",
    },
    {
      title: "Revenue Collected",
      value: formatCurrency(dashboardSummary.total_collection),
      icon: <Payments sx={{ fontSize: 42 }} />,
      color: "#22c55e",
    },
    {
      title: "Pending Revenue",
      value: formatCurrency(dashboardSummary.total_pending),
      icon: <AccountBalance sx={{ fontSize: 42 }} />,
      color: "#f59e0b",
    },
    {
      title: "Registered Citizens",
      value: dashboardSummary.total_citizens,
      icon: <People sx={{ fontSize: 42 }} />,
      color: "#a855f7",
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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            color: "white",
            fontWeight: 700,
          }}
        >
          CTCS Enterprise Platform{" "}
        </Typography>

        <Typography
          sx={{
            color: "#94a3b8",
            mt: 1,
          }}
        >
          Centralized Municipal Revenue Management & Tax Administration System
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {cards.map((card) => (
          <Grid key={card.title} xs={12} md={6} lg={3}>
            <Card
              sx={{
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",

                backdropFilter: "blur(20px)",

                border: "1px solid rgba(255,255,255,0.08)",

                color: "white",

                borderRadius: 4,

                transition: "0.3s",

                "&:hover": {
                  transform: "translateY(-6px)",
                },
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: "#94a3b8",
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h4"
                      sx={{
                        mt: 1,
                        fontWeight: 700,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      color: card.color,
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid xs={12} lg={8}>
          <Card
            sx={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
              borderRadius: 4,
              color: "white",
              minHeight: 620,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ mb: 3 }}>
                Revenue Analytics
              </Typography>

              <Grid container spacing={3}>
                <Grid xs={12} md={6}>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      mb: 1,
                    }}
                  >
                    Collection by Tax Type
                  </Typography>

                  {taxCollection.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <PieChart>
                        with
                        <Pie
                          data={taxCollection}
                          dataKey="total_collection"
                          nameKey="tax_name"
                          outerRadius={95}
                          innerRadius={45}
                          paddingAngle={3}
                          label={({ percent }) =>
                            `${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {taxCollection.map((entry, index) => (
                            <Cell
                              key={index}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "#17233c",
                            border: "none",
                            color: "white",
                          }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="#94a3b8">
                      No collection data available.
                    </Typography>
                  )}
                </Grid>

                <Grid xs={12} md={6}>
                  <Typography
                    sx={{
                      color: "#94a3b8",
                      mb: 1,
                    }}
                  >
                    Collection by Ward
                  </Typography>
                  {taxCollection.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={wardCollection}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#23314f" />

                        <XAxis
                          dataKey="ward_number"
                          tick={{ fill: "#94a3b8" }}
                        />

                        <YAxis tick={{ fill: "#94a3b8" }} />

                        <Tooltip
                          contentStyle={{
                            background: "#17233c",
                            border: "none",
                            color: "white",
                          }}
                        />

                        <Bar
                          dataKey="total_collection"
                          radius={[8, 8, 0, 0]}
                          fill="#3b82f6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography color="#94a3b8">
                      No collection data available.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} lg={4}>
          <Card
            sx={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

              minHeight: 350,

              color: "white",

              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6">System Insights</Typography>

              <Box sx={{ mt: 3 }}>
                <Typography>• Active Tax Collection Cycle</Typography>

                <Typography sx={{ mt: 2 }}>
                  • Revenue Monitoring Enabled
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  • Assessment Lifecycle Active
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  • Payment Engine Operational
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  • Multi-Tenant Security Enabled
                </Typography>

                <Typography sx={{ mt: 2 }}>
                  • Live data refreshed across dashboard, tax, and citizen
                  modules
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboard;
