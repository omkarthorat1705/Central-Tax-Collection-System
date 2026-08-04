import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getAuthorities } from "../../services/tenantService";

import { login } from "../../services/authService";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LoginPage = () => {
  const navigate = useNavigate();

  const [authorities, setAuthorities] = useState([]);

  const [authorityCode, setAuthorityCode] = useState("");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  useEffect(() => {
    loadAuthorities();
  }, []);

  const loadAuthorities = async () => {
    try {
      const data = await getAuthorities();

      setAuthorities(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await login(authorityCode, username, password);

      localStorage.setItem("token", result.token);

      localStorage.setItem("user", JSON.stringify(result.user));

      navigate("/admin-dashboard");
    } catch (error) {
      alert(error.response?.data?.error || "Login Failed");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg,#0f172a,#111827,#1e293b)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            borderRadius: 5,
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(25px)",
          }}
        >
          <CardContent sx={{ p: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>

            <Typography
              sx={{
                mb: 4,
                color: "#64748b",
              }}
            >
              CTCS Enterprise Login
            </Typography>

            <TextField
              select
              fullWidth
              label="Authority"
              margin="normal"
              value={authorityCode}
              onChange={(e) => setAuthorityCode(e.target.value)}
            >
              {authorities.map((authority) => (
                <MenuItem key={authority.id} value={authority.tenant_code}>
                  {authority.tenant_name}
                  {" ("}
                  {authority.tenant_code}
                  {")"}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              fullWidth
              type="password"
              label="Password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                sx={{ flex: 1 }}
              >
                Back
              </Button>

              <Button
                variant="contained"
                onClick={handleLogin}
                sx={{ flex: 2 }}
              >
                Login
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default LoginPage;
