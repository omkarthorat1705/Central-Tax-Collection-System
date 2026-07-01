import "../../styles/CreateCitizenPage.css";

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Grid,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";

import EnterpriseSummaryPanel from "../../components/enterprise/EnterpriseSummaryPanel";
import EnterpriseSectionCard from "../../components/enterprise/EnterpriseSectionCard";

import { getCitizenById, updateCitizen } from "../../services/citizenService";

const steps = [
  "Basic",
  "Contact",
  "Identity",
  "Address",
  "Communication",
  "Review",
];

export default function EditCitizenPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [activeStep, setActiveStep] = useState(0);

  const [errors, setErrors] = useState({});

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isDirty, setIsDirty] = useState(false);

  const [showExitDialog, setShowExitDialog] = useState(false);

  const [form, setForm] = useState({
    full_name: "",

    gender: "",
    date_of_birth: "",
    occupation: "",

    mobile_number: "",
    alternate_mobile: "",
    email: "",

    aadhaar_number: "",
    pan_number: "",

    address_line_1: "",
    address_line_2: "",
    locality: "",
    landmark: "",

    city: "",
    state: "",
    pincode: "",

    ward_number: "",
    zone_name: "",

    communication_sms: true,
    communication_email: true,
    communication_whatsapp: false,
    communication_post: false,
  });

  useEffect(() => {
    loadCitizen();
  }, []);

  const loadCitizen = async () => {
    try {
      const citizen = await getCitizenById(id);

      if (!citizen) {
        alert("Citizen not found");
        navigate("/citizens");
        return;
      }

      setForm({
        full_name: citizen.full_name || "",

        gender: citizen.gender || "",
        date_of_birth: citizen.date_of_birth || "",
        occupation: citizen.occupation || "",

        mobile_number: citizen.mobile_number || "",
        alternate_mobile: citizen.alternate_mobile || "",
        email: citizen.email || "",

        aadhaar_number: citizen.aadhaar_number || "",
        pan_number: citizen.pan_number || "",

        address_line_1: citizen.address_line_1 || "",
        address_line_2: citizen.address_line_2 || "",
        locality: citizen.locality || "",
        landmark: citizen.landmark || "",

        city: citizen.city || "",
        state: citizen.state || "",
        pincode: citizen.pincode || "",

        ward_number: citizen.ward_number || "",
        zone_name: citizen.zone_name || "",

        communication_sms: !!citizen.communication_sms,
        communication_email: !!citizen.communication_email,
        communication_whatsapp: !!citizen.communication_whatsapp,
        communication_post: !!citizen.communication_post,
      });
    } catch (error) {
      console.error(error);

      alert("Failed to load citizen");

      navigate("/citizens");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = () => {
    let completed = 0;

    if (form.full_name) completed++;
    if (form.mobile_number) completed++;
    if (form.email) completed++;
    if (form.aadhaar_number) completed++;
    if (form.address_line_1) completed++;
    if (form.city) completed++;
    if (form.pincode) completed++;

    return (completed / 7) * 100;
  };

  const progress = calculateProgress();

  const handleChange = (field, value) => {
    setIsDirty(true);

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!form.full_name?.trim()) {
        newErrors.full_name = "Citizen name is required";
      }
    }

    if (activeStep === 1) {
      if (!form.mobile_number) {
        newErrors.mobile_number = "Mobile number is required";
      }

      if (form.mobile_number && !/^[0-9]{10}$/.test(form.mobile_number)) {
        newErrors.mobile_number = "Enter valid 10 digit mobile number";
      }

      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        newErrors.email = "Enter valid email address";
      }
    }

    if (activeStep === 2) {
      if (form.aadhaar_number && !/^[0-9]{12}$/.test(form.aadhaar_number)) {
        newErrors.aadhaar_number = "Aadhaar must contain 12 digits";
      }

      if (
        form.pan_number &&
        !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan_number.toUpperCase())
      ) {
        newErrors.pan_number = "Invalid PAN format";
      }
    }

    if (activeStep === 3) {
      if (!form.city) {
        newErrors.city = "City is required";
      }

      if (!form.state) {
        newErrors.state = "State is required";
      }

      if (form.pincode && !/^[0-9]{6}$/.test(form.pincode)) {
        newErrors.pincode = "Enter valid 6 digit pincode";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const valid = validateStep();

    if (!valid) return;

    setActiveStep((prev) => prev + 1);
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);

    try {
      await updateCitizen(id, form);

      setIsDirty(false);

      alert("Citizen Updated Successfully");

      navigate("/citizens");
    } catch (error) {
      console.error(error);

      alert("Failed to update citizen");
    } finally {
      setSaving(false);
    }
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (activeStep) {
      case 0:
        if (!form.full_name?.trim()) {
          newErrors.full_name = "Citizen name is required";
        }

        if (!form.gender) {
          newErrors.gender = "Gender is required";
        }

        break;

      case 1:
        if (!form.mobile_number?.trim()) {
          newErrors.mobile_number = "Mobile number is required";
        } else if (!/^[0-9]{10}$/.test(form.mobile_number)) {
          newErrors.mobile_number = "Enter valid 10 digit mobile number";
        }

        if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
          newErrors.email = "Invalid email address";
        }

        break;

      case 2:
        if (form.aadhaar_number && !/^[0-9]{12}$/.test(form.aadhaar_number)) {
          newErrors.aadhaar_number = "Aadhaar must be 12 digits";
        }

        if (
          form.pan_number &&
          !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan_number)
        ) {
          newErrors.pan_number = "Invalid PAN format";
        }

        break;

      case 3:
        if (!form.address_line_1?.trim()) {
          newErrors.address_line_1 = "Address Line 1 is required";
        }

        if (!form.city?.trim()) {
          newErrors.city = "City is required";
        }

        if (!form.pincode || !/^[0-9]{6}$/.test(form.pincode)) {
          newErrors.pincode = "Enter valid 6 digit pincode";
        }

        break;

      default:
        break;
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  if (loading) {
  return (
    <AdminLayout
      sidebar={<AdminSidebar />}
      pageTitle="Edit Citizen"
    >
      <div
        style={{
          color: "white",
          padding: "40px",
        }}
      >
        Loading Citizen Details...
      </div>
    </AdminLayout>
  );
}

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Edit Citizen">
      <div className="citizen-page">
        <div className="citizen-header">
          <div className="citizen-title">Edit Citizen</div>

          <div className="citizen-subtitle">
            Create and maintain citizen master records for taxation, assessments
            and municipal services.
          </div>
        </div>

        <EnterpriseSectionCard>
          <Stepper activeStep={activeStep} className="enterprise-stepper">
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </EnterpriseSectionCard>

        <div className="citizen-body">
          <div className="citizen-form">
            {activeStep === 0 && (
              <EnterpriseSectionCard
                title="Basic Information"
                subtitle="Personal demographic details."
              >
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Citizen Full Name *"
                      placeholder="Enter citizen full legal name"
                      error={!!errors.full_name}
                      helperText={errors.full_name}
                      value={form.full_name}
                      onChange={(e) =>
                        handleChange("full_name", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      fullWidth
                      label="Gender *"
                      value={form.gender}
                      error={!!errors.gender}
                      helperText={errors.gender}
                      onChange={(e) => handleChange("gender", e.target.value)}
                    >
                      <MenuItem value="Male">Male</MenuItem>

                      <MenuItem value="Female">Female</MenuItem>

                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      type="date"
                      label="Date Of Birth"
                      inputlabelprops={{
                        shrink: true,
                      }}
                      value={form.date_of_birth}
                      onChange={(e) =>
                        handleChange("date_of_birth", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Occupation"
                      placeholder="Select or enter occupation"
                      value={form.occupation}
                      onChange={(e) =>
                        handleChange("occupation", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 1 && (
              <EnterpriseSectionCard
                title="Contact Information"
                subtitle="How municipality can reach the citizen."
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Primary Mobile Number *"
                      placeholder="10 digit mobile number"
                      error={!!errors.mobile_number}
                      helperText={errors.mobile_number}
                      value={form.mobile_number}
                      onChange={(e) =>
                        handleChange("mobile_number", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Alternate Mobile"
                      placeholder="Optional secondary number"
                      value={form.alternate_mobile}
                      onChange={(e) =>
                        handleChange("alternate_mobile", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      placeholder="example@domain.com"
                      error={!!errors.email}
                      helperText={errors.email}
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 2 && (
              <EnterpriseSectionCard
                title="Identity Information"
                subtitle="Government identification details."
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Aadhaar Number"
                      placeholder="12 digit Aadhaar number"
                      value={form.aadhaar_number}
                      onChange={(e) =>
                        handleChange("aadhaar_number", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="PAN Number"
                      placeholder="ABCDE1234F"
                      value={form.pan_number}
                      onChange={(e) =>
                        handleChange("pan_number", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 3 && (
              <EnterpriseSectionCard
                title="Address Information"
                subtitle="Primary residence and jurisdiction mapping."
              >
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Address Line 1 *"
                      error={!!errors.address_line_1}
                      helperText={errors.address_line_1}
                      value={form.address_line_1}
                      onChange={(e) =>
                        handleChange("address_line_1", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Address Line 2"
                      value={form.address_line_2}
                      onChange={(e) =>
                        handleChange("address_line_2", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Locality"
                      value={form.locality}
                      onChange={(e) => handleChange("locality", e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Landmark"
                      value={form.landmark}
                      onChange={(e) => handleChange("landmark", e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="City *"
                      error={!!errors.city}
                      helperText={errors.city}
                      value={form.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="State"
                      value={form.state}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      fullWidth
                      label="Pincode *"
                      error={!!errors.pincode}
                      helperText={errors.pincode}
                      value={form.pincode}
                      onChange={(e) => handleChange("pincode", e.target.value)}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Ward Number"
                      value={form.ward_number}
                      onChange={(e) =>
                        handleChange("ward_number", e.target.value)
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      fullWidth
                      label="Zone Name"
                      value={form.zone_name}
                      onChange={(e) =>
                        handleChange("zone_name", e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 4 && (
              <EnterpriseSectionCard
                title="Communication Preferences"
                subtitle="Preferred channels for notices and alerts."
              >
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.communication_sms}
                          onChange={(e) =>
                            handleChange("communication_sms", e.target.checked)
                          }
                        />
                      }
                      label="SMS Notifications"
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.communication_email}
                          onChange={(e) =>
                            handleChange(
                              "communication_email",
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label="Email Notifications"
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.communication_whatsapp}
                          onChange={(e) =>
                            handleChange(
                              "communication_whatsapp",
                              e.target.checked,
                            )
                          }
                        />
                      }
                      label="WhatsApp Notifications"
                    />
                  </Grid>

                  <Grid size={12}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={form.communication_post}
                          onChange={(e) =>
                            handleChange("communication_post", e.target.checked)
                          }
                        />
                      }
                      label="Postal Communication"
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 5 && (
              <EnterpriseSectionCard
                title="Review & Submit"
                subtitle="Validate details before citizen creation."
              >
                <div className="review-grid">
                  <div className="review-card">
                    <h4>Basic Information</h4>

                    <p>
                      <strong>Name:</strong> {form.full_name}
                    </p>
                    <p>
                      <strong>Gender:</strong> {form.gender}
                    </p>
                    <p>
                      <strong>DOB:</strong> {form.date_of_birth}
                    </p>
                    <p>
                      <strong>Occupation:</strong> {form.occupation}
                    </p>
                  </div>

                  <div className="review-card">
                    <h4>Contact</h4>

                    <p>
                      <strong>Mobile:</strong> {form.mobile_number}
                    </p>
                    <p>
                      <strong>Alternate:</strong> {form.alternate_mobile}
                    </p>
                    <p>
                      <strong>Email:</strong> {form.email}
                    </p>
                  </div>

                  <div className="review-card">
                    <h4>Identity</h4>

                    <p>
                      <strong>Aadhaar:</strong> ******
                    </p>
                    <p>
                      <strong>PAN:</strong> ******
                    </p>
                  </div>

                  <div className="review-card">
                    <h4>Address</h4>

                    <p>{form.address_line_1}</p>
                    <p>{form.address_line_2}</p>
                    <p>{form.locality}</p>
                    <p>{form.city}</p>
                    <p>{form.state}</p>
                    <p>{form.pincode}</p>
                  </div>
                </div>
              </EnterpriseSectionCard>
            )}

            <div className="step-footer">
              <Button
                color="inherit"
                onClick={() => {
                  if (isDirty) {
                    setShowExitDialog(true);
                  } else {
                    navigate("/citizens");
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                startIcon={<ArrowBackIcon />}
                disabled={activeStep === 0}
                onClick={() => setActiveStep(activeStep - 1)}
              >
                Previous
              </Button>

              {activeStep !== 5 ? (
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    if (validateCurrentStep()) {
                      handleNext();
                    }
                  }}
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Updating Citizen..." : "Update Citizen"}
                </Button>
              )}
            </div>
          </div>

          <div className="citizen-summary">
            <EnterpriseSummaryPanel
              progress={progress}
              citizenCode="AUTO-GENERATED"
              status="ACTIVE"
              verification="PENDING"
              fullName={form.full_name}
              mobile={form.mobile_number}
              city={form.city}
            />
          </div>
        </div>
      </div>
      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>

        <DialogContent>
          <Typography>
            You have unsaved changes on this page. If you leave now, all entered
            information will be lost.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Stay</Button>

          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setShowExitDialog(false);
              navigate("/citizens");
            }}
          >
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}
