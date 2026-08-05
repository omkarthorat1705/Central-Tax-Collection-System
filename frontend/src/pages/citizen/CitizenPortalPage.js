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

  const totalAssessment = summary.assessments.reduce(
    (sum, item) => sum + Number(item.total_amount || 0),
    0,
  );

  const totalPaid = summary.payments.reduce(
    (sum, item) => sum + Number(item.payment_amount || 0),
    0,
  );

  const outstanding = Math.max(0, totalAssessment - totalPaid);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        py: 6,
      }}
    >
      <Container maxWidth="xl">
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
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  Citizen Dashboard
                </Typography>

                <Typography
                  sx={{
                    color: "#94a3b8",
                    mt: 0.5,
                  }}
                >
                  Welcome back,
                  <strong> {citizen.full_name}</strong>
                  {" • "}
                  {citizen.citizen_code}
                </Typography>
              </Box>

              <Button variant="outlined" color="error" onClick={handleLogout}>
                Logout
              </Button>
            </Box>

            <Grid
              container
              spacing={3}
              sx={{
                mb: 4,
              }}
            >
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#132238",
                  }}
                >
                  <Typography color="#94a3b8">Outstanding Due</Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      color: "#ef4444",
                      fontWeight: 700,
                    }}
                  >
                    ₹
                    {Math.max(
                      0,
                      summary.assessments.reduce(
                        (t, a) => t + Number(a.total_amount || 0),
                        0,
                      ) -
                        summary.payments.reduce(
                          (t, p) => t + Number(p.payment_amount || 0),
                          0,
                        ),
                    ).toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#132238",
                  }}
                >
                  <Typography color="#94a3b8">Assessments</Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      color: "#38bdf8",
                      fontWeight: 700,
                    }}
                  >
                    {summary.assessments.length}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#132238",
                  }}
                >
                  <Typography color="#94a3b8">Payments</Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      color: "#22c55e",
                      fontWeight: 700,
                    }}
                  >
                    {summary.payments.length}
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#132238",
                  }}
                >
                  <Typography color="#94a3b8">Amount Paid</Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      color: "#22c55e",
                      fontWeight: 700,
                    }}
                  >
                    ₹
                    {summary.payments
                      .reduce((t, p) => t + Number(p.payment_amount || 0), 0)
                      .toFixed(2)}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            <Grid container spacing={3} alignItems="flex-start">
              <Grid item xs={12} lg={3}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#132238",
                    height: 650,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Outstanding Assessments
                  </Typography>
                  <Box
                    sx={{
                      overflowY: "auto",
                      pr: 1,
                      flex: 1,
                    }}
                  >
                    {summary.assessments.length === 0 ? (
                      <Typography color="#94a3b8">
                        No assessments available.
                      </Typography>
                    ) : (
                      summary.assessments
                        .filter((a) => a.assessment_status !== "PAID")
                        .map((assessment) => {
                          const paid = summary.payments
                            .filter(
                              (payment) =>
                                Number(payment.assessment_id) ===
                                Number(assessment.id),
                            )
                            .reduce(
                              (sum, payment) =>
                                sum + Number(payment.payment_amount || 0),
                              0,
                            );

                          const balance =
                            Number(assessment.total_amount) - paid;

                          return (
                            <Paper
                              key={assessment.id}
                              sx={{
                                p: 2,
                                mb: 2,
                                background: "#1e293b",
                                borderRadius: 2,
                              }}
                            >
                              <Typography
                                sx={{
                                  color: "#fff",
                                  fontWeight: 700,
                                }}
                              >
                                {assessment.assessment_number}
                              </Typography>

                              <Typography color="#94a3b8">
                                ₹ {Number(assessment.total_amount).toFixed(2)}
                              </Typography>

                              <Typography color="#22c55e">
                                Balance : ₹ {balance.toFixed(2)}
                              </Typography>

                              <Button
                                size="small"
                                sx={{ mt: 1 }}
                                variant="contained"
                                onClick={() =>
                                  setPaymentForm({
                                    assessment_id: assessment.id,
                                    payment_amount:
                                      balance > 0 ? balance.toFixed(2) : "",
                                    payment_mode: "CASH",
                                  })
                                }
                              >
                                Pay Now
                              </Button>
                            </Paper>
                          );
                        })
                    )}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: "#132238",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#fff",
                      fontWeight: 700,
                      mb: 2,
                    }}
                  >
                    Make Payment
                  </Typography>

                  <Stack spacing={2}>
                    <TextField
                      select
                      label="Assessment"
                      value={paymentForm.assessment_id}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          assessment_id: e.target.value,
                        })
                      }
                    >
                      {summary.assessments
                        .filter((a) => a.assessment_status !== "PAID")
                        .map((assessment) => (
                          <MenuItem key={assessment.id} value={assessment.id}>
                            {assessment.assessment_number}
                          </MenuItem>
                        ))}
                    </TextField>

                    <TextField
                      label="Amount"
                      type="number"
                      value={paymentForm.payment_amount}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_amount: e.target.value,
                        })
                      }
                    />

                    <TextField
                      select
                      label="Payment Mode"
                      value={paymentForm.payment_mode}
                      onChange={(e) =>
                        setPaymentForm({
                          ...paymentForm,
                          payment_mode: e.target.value,
                        })
                      }
                    >
                      <MenuItem value="CASH">Cash</MenuItem>
                      <MenuItem value="ONLINE">Online</MenuItem>
                      <MenuItem value="CHEQUE">Cheque</MenuItem>
                    </TextField>

                    <Button variant="contained" onClick={handlePayment}>
                      Pay
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={12} lg={4}>
                <Stack spacing={3}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "#132238",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#fff",
                        mb: 2,
                      }}
                    >
                      Citizen Profile
                    </Typography>

                    <Typography color="#94a3b8">Name</Typography>

                    <Typography color="#fff" sx={{ mb: 2 }}>
                      {citizen.full_name}
                    </Typography>

                    <Typography color="#94a3b8">Citizen Code</Typography>

                    <Typography color="#fff" sx={{ mb: 2 }}>
                      {citizen.citizen_code}
                    </Typography>

                    <Typography color="#94a3b8">Authority</Typography>

                    <Typography color="#fff">{citizen.tenant_name}</Typography>
                  </Paper>

                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "#132238",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#fff",
                        mb: 2,
                      }}
                    >
                      Recent Payments
                    </Typography>

                    {summary.payments.length === 0 ? (
                      <Typography color="#94a3b8">
                        No payments available.
                      </Typography>
                    ) : (
                      summary.payments.slice(0, 5).map((payment) => (
                        <Box
                          key={payment.id}
                          sx={{
                            borderBottom: "1px solid rgba(255,255,255,.06)",
                            py: 1,
                          }}
                        >
                          <Typography
                            sx={{
                              color: "#fff",
                              fontWeight: 600,
                            }}
                          >
                            {payment.payment_number}
                          </Typography>

                          <Typography color="#94a3b8">
                            ₹ {Number(payment.payment_amount).toFixed(2)}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </Paper>
                </Stack>
              </Grid>
            </Grid>

            {/* <Paper
              sx={{
                mt: 3,
                p: 3,
                borderRadius: 3,
                background: "#132238",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: 700,
                  mb: 2,
                }}
              >
                Change Password
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,

                        currentPassword: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={5}>
                  <TextField
                    fullWidth
                    label="New Password"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,

                        newPassword: e.target.value,
                      })
                    }
                  />
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ height: "100%" }}
                    onClick={handlePasswordChange}
                  >
                    Update
                  </Button>
                </Grid>
              </Grid>
            </Paper> */}
          </>
        )}
      </Container>
    </Box>
  );
};

export default CitizenPortalPage;
