import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const CitizenPortalPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ tenantCode: "", citizenCode: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [citizen, setCitizen] = useState(null);
  const [summary, setSummary] = useState({ assessments: [], payments: [] });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await API.post("/citizen/login", form);
      const data = response.data.data;
      localStorage.setItem("citizenToken", data.token);
      localStorage.setItem("citizen", JSON.stringify(data.citizen));
      setCitizen(data.citizen);
      await loadPortal();
    } catch (error) {
      alert(error.response?.data?.error || "Citizen login failed");
    } finally {
      setLoading(false);
    }
  };

  const loadPortal = async () => {
    try {
      const response = await API.get("/citizen/portal");
      setSummary(response.data.data || { assessments: [], payments: [] });
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("citizenToken");
    localStorage.removeItem("citizen");
    setCitizen(null);
    setSummary({ assessments: [], payments: [] });
  };

  useEffect(() => {
    const savedCitizen = localStorage.getItem("citizen");
    if (savedCitizen) {
      setCitizen(JSON.parse(savedCitizen));
      loadPortal();
    }
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)", py: 6 }}>
      <Container maxWidth="md">
        {!citizen ? (
          <Card sx={{ borderRadius: 4, background: "rgba(255,255,255,0.06)", backdropFilter: "blur(20px)" }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
                Citizen Portal Login
              </Typography>
              <Typography sx={{ color: "#94a3b8", mt: 1, mb: 3 }}>
                Sign in with your citizen credentials to view applicable taxes and payments.
              </Typography>

              <Stack spacing={2}>
                <TextField label="Authority Code" name="tenantCode" value={form.tenantCode} onChange={handleChange} fullWidth />
                <TextField label="Citizen Code" name="citizenCode" value={form.citizenCode} onChange={handleChange} fullWidth />
                <TextField label="Password" name="password" type="password" value={form.password} onChange={handleChange} fullWidth />
                <Button variant="contained" size="large" onClick={handleLogin} disabled={loading}>
                  {loading ? "Signing In..." : "Login"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box>
                <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
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
                <Paper sx={{ p: 3, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                  <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                    Your Assessments
                  </Typography>
                  {summary.assessments.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8" }}>No assessments found.</Typography>
                  ) : (
                    summary.assessments.map((item) => (
                      <Box key={item.id} sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 1.5 }}>
                        <Typography sx={{ color: "white" }}>{item.tax_name || "Tax"}</Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                          #{item.assessment_number} • {item.financial_year} • ₹{Number(item.total_amount || 0).toFixed(2)}
                        </Typography>
                        <Typography sx={{ color: "#38bdf8", fontSize: 13 }}>{item.assessment_status}</Typography>
                      </Box>
                    ))
                  )}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 3, background: "rgba(255,255,255,0.04)" }}>
                  <Typography sx={{ color: "white", fontWeight: 700, mb: 2 }}>
                    Recent Payments
                  </Typography>
                  {summary.payments.length === 0 ? (
                    <Typography sx={{ color: "#94a3b8" }}>No payments found.</Typography>
                  ) : (
                    summary.payments.map((item) => (
                      <Box key={item.id} sx={{ borderBottom: "1px solid rgba(255,255,255,0.08)", py: 1.5 }}>
                        <Typography sx={{ color: "white" }}>{item.payment_number}</Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13 }}>
                          {item.payment_mode} • ₹{Number(item.payment_amount || 0).toFixed(2)}
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
