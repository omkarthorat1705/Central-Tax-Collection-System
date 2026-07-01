import { useEffect, useState } from "react";

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

import { getRevenueSummary } from "../services/dashboardService";
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

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({
    total_assessment: 0,
    total_collection: 0,
    total_pending: 0,
    partial_cases: 0,
  });

  // const user = getCurrentUser();

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getRevenueSummary();

      setSummary(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Total Assessments",
      value: summary.total_assessment,
      icon: <Assessment sx={{ fontSize: 42 }} />,
      color: "#38bdf8",
    },

    {
      title: "Revenue Collected",
      value: formatCurrency(summary.total_collection),
      icon: <Payments sx={{ fontSize: 42 }} />,
      color: "#22c55e",
    },

    {
      title: "Pending Revenue",
      value: formatCurrency(summary.total_pending),
      icon: <AccountBalance sx={{ fontSize: 42 }} />,
      color: "#f59e0b",
    },

    {
      title: "Partial Cases",
      value: summary.partial_cases,
      icon: <People sx={{ fontSize: 42 }} />,
      color: "#a855f7",
    },
  ];

  const navigate = useNavigate();

  // const user = JSON.parse(localStorage.getItem("user")) || {};

  // const handleLogout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");

  //   navigate("/login");
  // };

  // const header = (
  //   <Box
  //     sx={{
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //       width: "100%",
  //     }}
  //   >
  //     <Typography
  //       variant="h5"
  //       sx={{
  //         color: "white",
  //         fontWeight: 700,
  //       }}
  //     >
  //       Revenue Administration Dashboard
  //     </Typography>

  //     <Box
  //       sx={{
  //         display: "flex",
  //         alignItems: "center",
  //         gap: 3,
  //       }}
  //     >
  //       <Box>
  //         <Typography
  //           sx={{
  //             color: "white",
  //             fontWeight: 700,
  //           }}
  //         >
  //           {user.tenant_name}
  //         </Typography>

  //         <Typography
  //           sx={{
  //             color: "#94a3b8",
  //             fontSize: 13,
  //           }}
  //         >
  //           Authority Code: {user.tenant_code}
  //         </Typography>
  //       </Box>

  //       <Box>
  //         <Typography
  //           sx={{
  //             color: "white",
  //             fontWeight: 600,
  //           }}
  //         >
  //           {user.full_name}
  //         </Typography>

  //         <Typography
  //           sx={{
  //             color: "#94a3b8",
  //             fontSize: 13,
  //           }}
  //         >
  //           {user.role}
  //         </Typography>
  //       </Box>

  //       <IconButton
  //         onClick={handleLogout}
  //         sx={{
  //           color: "white",
  //         }}
  //       >
  //         <LogoutIcon />
  //       </IconButton>
  //     </Box>
  //   </Box>
  // );

  if (loading) {
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

              minHeight: 350,

              color: "white",

              borderRadius: 4,
            }}
          >
            <CardContent>
              <Typography variant="h6">Revenue Analytics</Typography>

              <Typography
                sx={{
                  mt: 2,
                  color: "#94a3b8",
                }}
              >
                Revenue charts, assessment trends, collection performance and
                demand analysis will be integrated in the next phase using
                Recharts.
              </Typography>
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
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default AdminDashboard;
