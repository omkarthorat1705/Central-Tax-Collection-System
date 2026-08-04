import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";
import { getAuthorities } from "../../services/tenantService";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const CitizenPortalPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tenantCode: "",
    citizenCode: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [authorities, setAuthorities] = useState([]);
  const [citizen, setCitizen] = useState(null);
  const [summary, setSummary] = useState({ assessments: [], payments: [] });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [paymentForm, setPaymentForm] = useState({
    assessment_id: "",
    payment_amount: "",
    payment_mode: "CASH",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const loadAuthorities = async () => {
    try {
      const data = await getAuthorities();

      setAuthorities(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);

      if (!form.tenantCode || !form.citizenCode || !form.password) {
        alert("Please fill all fields.");
        return;
      }
const response = await API.post("/citizen/login", form);

const loginData = response.data.data;

localStorage.setItem("citizenToken", loginData.token);
localStorage.setItem("citizen", JSON.stringify(loginData.citizen));

setCitizen(loginData.citizen);

// IMPORTANT
await new Promise((resolve) => setTimeout(resolve, 20));

const portalResponse = await API.get("/citizen/portal");

setSummary(
    portalResponse.data.data || {
        assessments: [],
        payments: [],
    },
);
    } catch (error) {
      alert(error.response?.data?.error || "Citizen login failed");
    } finally {
      setLoading(false);
    }
  };

  const loadPortal = async () => {
    try {
      const token = localStorage.getItem("citizenToken");

      if (!token) return;

      const response = await API.get("/citizen/portal");

      setSummary(
        response.data.data || {
          assessments: [],
          payments: [],
        },
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("citizenToken");
    localStorage.removeItem("citizen");
    setCitizen(null);
    setSummary({ assessments: [], payments: [] });
    setPaymentForm({
      assessment_id: "",

      payment_amount: "",

      payment_mode: "CASH",
    });
    setPasswordForm({
      currentPassword: "",

      newPassword: "",
    });
    delete API.defaults.headers.common.Authorization;
    navigate("/");
  };

  const handlePasswordChange = async () => {
    try {
      await API.put("/citizen/password", passwordForm);
      alert("Password updated successfully");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      alert(error.response?.data?.error || "Password change failed");
    }
  };

  const handlePayment = async () => {
    try {
      await API.post("/citizen/payment", paymentForm);
      alert("Payment recorded successfully");
      setPaymentForm({
        assessment_id: "",
        payment_amount: "",
        payment_mode: "CASH",
      });
      await loadPortal();
    } catch (error) {
      alert(error.response?.data?.error || "Payment failed");
    }
  };

  useEffect(() => {
    loadAuthorities();

    const citizen = localStorage.getItem("citizen");

    const storedCitizen = localStorage.getItem("citizen");

    if (storedCitizen) {
      setCitizen(JSON.parse(storedCitizen));
    }

    loadPortal();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        py: 6,
      }}
    >
      <Container maxWidth="md">
        {!citizen ? (
          <Card
            sx={{
              borderRadius: 4,

              background: "rgba(255,255,255,.05)",

              backdropFilter: "blur(12px)",

              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                Citizen Portal Login
              </Typography>
              <Typography sx={{ color: "#94a3b8", mt: 1, mb: 3 }}>
                Sign in with your citizen credentials to view applicable taxes
                and payments.
              </Typography>

              <Stack spacing={2}>
                <TextField
                  select
                  label="Authority"
                  name="tenantCode"
                  value={form.tenantCode}
                  onChange={handleChange}
                  fullWidth
                >
                  {authorities.map((authority) => (
                    <MenuItem
                      key={authority.tenant_code}
                      value={authority.tenant_code}
                    >
                      {authority.tenant_name}
                      {" ("}
                      {authority.tenant_code}
                      {")"}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Citizen Code"
                  name="citizenCode"
                  value={form.citizenCode}
                  onChange={handleChange}
                  fullWidth
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  fullWidth
                />
                <Box
                  sx={{
                    display: "flex",
                    gap: 2,
                    mt: 4,
                  }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/")}
                  >
                    Back
                  </Button>

                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ flex: 2 }}
                      onClick={handleLogin}
                    >
                      Login
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{ color: "white", fontWeight: 700 }}
                >
                  Welcome, {citizen.full_name}
                </Typography>
                <Typography sx={{ color: "#94a3b8", mt: 0.5 }}>
                  {citizen.tenant_name} • {citizen.citizen_code}
                </Typography>
              </Box>
              <Button variant="outlined" onClick={handleLogout}>
                Logout
              </Button>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.04)",
                    mb: 2,
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                    Change Password
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Current Password"
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: event.target.value,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="New Password"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(event) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: event.target.value,
                        })
                      }
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handlePasswordChange}
                    >
                      Update Password
                    </Button>
                  </Stack>
                </Paper>

                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                    Make Payment
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      label="Assessment ID"
                      value={paymentForm.assessment_id}
                      onChange={(event) =>
                        setPaymentForm({
                          ...paymentForm,
                          assessment_id: event.target.value,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Amount"
                      value={paymentForm.payment_amount}
                      onChange={(event) =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_amount: event.target.value,
                        })
                      }
                      fullWidth
                    />
                    <TextField
                      label="Payment Mode"
                      value={paymentForm.payment_mode}
                      onChange={(event) =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_mode: event.target.value,
                        })
                      }
                      fullWidth
                    />
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={handlePayment}
                    >
                      Record Payment
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                    Your Assessments
                  </Typography>
                  {summary.assessments.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8" }}>
                      No assessments found.
                    </Typography>
                  ) : (
                    summary.assessments.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          py: 1.5,
                        }}
                      >
                        <Typography sx={{ color: "white" }}>
                          {item.tax_name || "Tax"}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                          #{item.assessment_number} • {item.financial_year} • ₹
                          {Number(item.total_amount || 0).toFixed(2)}
                        </Typography>
                        <Typography sx={{ color: "#38bdf8", fontSize: 13 }}>
                          {item.assessment_status}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                    Recent Payments
                  </Typography>
                  {summary.payments.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8" }}>
                      No payments found.
                    </Typography>
                  ) : (
                    summary.payments.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                          py: 1.5,
                        }}
                      >
                        <Typography sx={{ color: "white" }}>
                          {item.payment_number}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                          {item.payment_mode} • ₹
                          {Number(item.payment_amount || 0).toFixed(2)}
                        </Typography>
                      </Box>
                    ))
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CitizenPortalPage;
