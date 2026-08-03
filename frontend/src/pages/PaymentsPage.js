import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import AdminLayout from "../layouts/AdminLayout";
import AdminSidebar from "../components/AdminSidebar";
import EnterpriseSectionCard from "../components/enterprise/EnterpriseSectionCard";
import API from "../api/api";

const PaymentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("CASH");
  const [helperText, setHelperText] = useState(
    "Choose an outstanding assessment and enter the amount to collect.",
  );
  const [payments, setPayments] = useState([]);
  const [selectedAssessmentData, setSelectedAssessmentData] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadAssessments = async () => {
    try {
      const response = await API.get("/getAssessments");
      setAssessments(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadPayments = async () => {
    try {
      setLoading(true);
      const response = await API.get("/getPayments");
      setPayments(response.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
    loadPayments();
  }, []);

  const makePayment = async () => {
    if (!selectedAssessment || !paymentAmount) {
      alert("Please choose an assessment and payment amount.");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/makePayment", {
        assessment_id: selectedAssessment,
        payment_amount: paymentAmount,
        payment_mode: paymentMode,
      });
      setPaymentAmount("");
      setSelectedAssessment("");
      setSelectedAssessmentData(null);
      setHelperText(
        "Payment recorded successfully. It will appear in the payment ledger below.",
      );
      await loadPayments();
      await loadAssessments();
      alert("Payment collected successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to collect payment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Payments">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Revenue Collections
          </Typography>
          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Record payments and track collection activity for assessments.
          </Typography>
        </Box>

        <EnterpriseSectionCard
          title="Collect Payment"
          subtitle="Record a payment against an outstanding assessment."
        >
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                select
                fullWidth
                label="Assessment *"
                value={selectedAssessment}
                onChange={(event) => {
                  const assessment = assessments.find(
                    (a) => Number(a.id) === Number(event.target.value),
                  );

                  setSelectedAssessment(event.target.value);
                  setSelectedAssessmentData(assessment || null);

                  if (assessment) {
                    const paid = Number(assessment.paid_amount || 0);

                    const total = Number(assessment.total_amount || 0);

                    const balance = total - paid;

                    setPaymentAmount(balance > 0 ? balance : "");

                    setHelperText(
                      `Outstanding Balance : ₹${balance.toFixed(2)}`,
                    );
                  }
                }}
                helperText={
                  assessments.length === 0
                    ? "Generate an assessment first so there is an outstanding balance to collect."
                    : helperText
                }
              >
                {assessments.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.assessment_number || `ASM-${item.id}`} • ₹
                    {Number(item.total_amount || 0).toFixed(2)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Payment Amount *"
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                helperText="Enter an amount that is less than or equal to the assessment balance."
                inputProps={{
                  min: 1,
                  max: selectedAssessmentData
                    ? Number(selectedAssessmentData.total_amount) -
                      Number(selectedAssessmentData.paid_amount || 0)
                    : undefined,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                select
                fullWidth
                label="Payment Mode"
                value={paymentMode}
                onChange={(event) => setPaymentMode(event.target.value)}
              >
                <MenuItem value="CASH">Cash</MenuItem>
                <MenuItem value="UPI">UPI</MenuItem>
                <MenuItem value="CARD">Card</MenuItem>
                <MenuItem value="BANK">Bank</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          {selectedAssessmentData && (
            <Grid size={12}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  background: "#132238",
                  border: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <Typography color="white" fontWeight={700}>
                  Assessment Summary
                </Typography>

                <Typography color="#cbd5e1">
                  Assessment :{selectedAssessmentData.assessment_number}
                </Typography>

                <Typography color="#cbd5e1">
                  Total : ₹
                  {Number(selectedAssessmentData.total_amount).toFixed(2)}
                </Typography>

                <Typography color="#cbd5e1">
                  Paid : ₹
                  {Number(selectedAssessmentData.paid_amount || 0).toFixed(2)}
                </Typography>

                <Typography
                  sx={{
                    color: "#10b981",
                    fontWeight: 700,
                  }}
                >
                  Balance : ₹
                  {(
                    Number(selectedAssessmentData.total_amount) -
                    Number(selectedAssessmentData.paid_amount || 0)
                  ).toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          )}

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<PaymentsIcon />}
              onClick={makePayment}
              disabled={submitting}
            >
              {submitting ? "Recording..." : "Collect Payment"}
            </Button>
          </Box>
        </EnterpriseSectionCard>

        <EnterpriseSectionCard
          title="Payment Ledger"
          subtitle="Recent payments recorded in the system."
        >
          <Grid container spacing={2}>
            {loading ? (
              <Grid size={12}>
                <Typography color="text.secondary">
                  Loading payments...
                </Typography>
              </Grid>
            ) : payments.length === 0 ? (
              <Grid size={12}>
                <Typography color="text.secondary">
                  No payments recorded yet. Use the form above to collect the
                  first payment.
                </Typography>
              </Grid>
            ) : (
              payments.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <Box
                    sx={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 3,
                      p: 2.5,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Box>
                        <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                          {item.payment_number || `RCPT-${item.id}`}
                        </Typography>
                        <Typography
                          sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}
                        >
                          {item.assessment_number || "Assessment"}
                        </Typography>
                      </Box>
                      <Chip
                        label={item.payment_mode || "CASH"}
                        color="success"
                        size="small"
                      />
                    </Box>
                    <Typography sx={{ color: "#94a3b8", mt: 2 }}>
                      Amount: ₹{Number(item.payment_amount || 0).toFixed(2)}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8" }}>
                      Date: {item.payment_date || "—"}
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

export default PaymentsPage;
