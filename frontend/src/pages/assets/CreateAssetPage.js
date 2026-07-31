import "../../styles/CreateCitizenPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  MenuItem,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SaveIcon from "@mui/icons-material/Save";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";
import EnterpriseSectionCard from "../../components/enterprise/EnterpriseSectionCard";
import EnterpriseSummaryPanel from "../../components/enterprise/EnterpriseSummaryPanel";

import assetService from "../../services/assetService";
import { getCitizens } from "../../services/citizenService";

const steps = ["Asset Details", "Tax Assignment", "Assessment Parameters", "Review"];

export default function CreateAssetPage() {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(0);
  const [citizens, setCitizens] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [taxTypes, setTaxTypes] = useState([]);
  const [selectedTaxes, setSelectedTaxes] = useState([]);
  const [parameters, setParameters] = useState([]);
  const [parameterValues, setParameterValues] = useState({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);

  const [form, setForm] = useState({
    citizen_id: "",
    asset_name: "",
    asset_type: "",
    asset_address: "",
  });

  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [citizenData, assetTypeData, taxData] = await Promise.all([
          getCitizens(),
          assetService.getAssetTypes(),
          assetService.getTaxTypes(),
        ]);

        if (isMounted) {
          setCitizens(citizenData || []);
          setAssetTypes(assetTypeData || []);
          setTaxTypes(taxData || []);
        }
      } catch (error) {
        console.error(error);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (field, value) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTaxSelection = async (taxId) => {
    setIsDirty(true);

    const updatedTaxes = selectedTaxes.includes(taxId)
      ? selectedTaxes.filter((id) => id !== taxId)
      : [...selectedTaxes, taxId];

    setSelectedTaxes(updatedTaxes);

    try {
      const parameterData = await assetService.getAssetParameters(updatedTaxes);
      setParameters(parameterData || []);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({ ...prev, taxes: "Unable to load assessment parameters." }));
    }
  };

  const handleParameterChange = (parameterId, value) => {
    setParameterValues((prev) => ({ ...prev, [parameterId]: value }));
  };

  const calculateProgress = () => {
    let completed = 0;

    if (form.citizen_id) completed += 1;
    if (form.asset_name) completed += 1;
    if (form.asset_type) completed += 1;
    if (form.asset_address) completed += 1;
    if (selectedTaxes.length > 0) completed += 1;

    return (completed / 5) * 100;
  };

  const progress = calculateProgress();

  const validateCurrentStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!form.citizen_id) {
        newErrors.citizen_id = "Citizen is required";
      }

      if (!form.asset_name?.trim()) {
        newErrors.asset_name = "Asset name is required";
      }

      if (!form.asset_type) {
        newErrors.asset_type = "Asset type is required";
      }
    }

    if (activeStep === 1 && selectedTaxes.length === 0) {
      newErrors.taxes = "Please select at least one tax type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleSave = async () => {
    if (saving) return;

    if (!validateCurrentStep()) {
      return;
    }

    try {
      setSaving(true);

      await assetService.createAsset({
        ...form,
        tax_type_ids: selectedTaxes,
        parameter_values: parameterValues,
      });

      setIsDirty(false);
      alert("Asset registered successfully");
      navigate("/assets");
    } catch (error) {
      console.error(error);
      alert("Failed to register asset");
    } finally {
      setSaving(false);
    }
  };

  const selectedCitizen = citizens.find((citizen) => String(citizen.id) === String(form.citizen_id)) || {};

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Asset Registration">
      <div className="citizen-page">
        <div className="citizen-header">
          <div className="citizen-title">Asset Registration</div>
          <div className="citizen-subtitle">
            Register citizen assets and map applicable tax types for assessment.
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
              <EnterpriseSectionCard title="Asset Information" subtitle="Register the primary asset details.">
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      select
                      fullWidth
                      label="Citizen *"
                      value={form.citizen_id}
                      error={!!errors.citizen_id}
                      helperText={errors.citizen_id}
                      onChange={(event) => handleChange("citizen_id", event.target.value)}
                    >
                      {citizens.map((citizen) => (
                        <MenuItem key={citizen.id} value={citizen.id}>
                          {citizen.citizen_code} - {citizen.full_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Asset Name *"
                      value={form.asset_name}
                      error={!!errors.asset_name}
                      helperText={errors.asset_name}
                      onChange={(event) => handleChange("asset_name", event.target.value)}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      select
                      fullWidth
                      label="Asset Type *"
                      value={form.asset_type}
                      error={!!errors.asset_type}
                      helperText={errors.asset_type}
                      onChange={(event) => handleChange("asset_type", event.target.value)}
                    >
                      {assetTypes.map((type) => (
                        <MenuItem key={type.id} value={type.asset_type_name}>
                          {type.asset_type_name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Asset Address"
                      value={form.asset_address}
                      onChange={(event) => handleChange("asset_address", event.target.value)}
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 1 && (
              <EnterpriseSectionCard title="Applicable Taxes" subtitle="Select the tax types that apply to this asset.">
                <Grid container spacing={2}>
                  {taxTypes.map((tax) => (
                    <Grid size={{ xs: 12, md: 6 }} key={tax.id}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedTaxes.includes(tax.id)}
                            onChange={() => handleTaxSelection(tax.id)}
                          />
                        }
                        label={tax.tax_name}
                      />
                    </Grid>
                  ))}
                </Grid>

                {errors.taxes && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {errors.taxes}
                  </Typography>
                )}
              </EnterpriseSectionCard>
            )}

            {activeStep === 2 && (
              <EnterpriseSectionCard title="Assessment Parameters" subtitle="Capture any tax-specific parameter values.">
                <Grid container spacing={3}>
                  {parameters.length === 0 ? (
                    <Grid size={12}>
                      <Typography color="text.secondary">
                        No assessment parameters are available for the selected tax types yet.
                      </Typography>
                    </Grid>
                  ) : (
                    parameters.map((parameter) => {
                      const options = parameter.possible_values?.split(",").map((value) => value.trim()).filter(Boolean) || [];

                      if (parameter.ui_component === "DROPDOWN") {
                        return (
                          <Grid size={{ xs: 12, md: 6 }} key={parameter.id}>
                            <TextField
                              select
                              fullWidth
                              label={parameter.parameter_name}
                              value={parameterValues[parameter.id] ?? ""}
                              onChange={(event) => handleParameterChange(parameter.id, event.target.value)}
                            >
                              {options.map((option, index) => (
                                <MenuItem key={`${parameter.id}-${index}`} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>
                        );
                      }

                      return (
                        <Grid size={{ xs: 12, md: 6 }} key={parameter.id}>
                          <TextField
                            fullWidth
                            label={parameter.parameter_name}
                            value={parameterValues[parameter.id] ?? ""}
                            onChange={(event) => handleParameterChange(parameter.id, event.target.value)}
                          />
                        </Grid>
                      );
                    })
                  )}
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 3 && (
              <EnterpriseSectionCard title="Review & Submit" subtitle="Verify the asset registration details before saving.">
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography><strong>Citizen:</strong> {selectedCitizen.full_name || "Not selected"}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography><strong>Asset Name:</strong> {form.asset_name}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography><strong>Asset Type:</strong> {form.asset_type}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography><strong>Selected Taxes:</strong> {selectedTaxes.length}</Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography><strong>Assessment Parameters:</strong> {Object.keys(parameterValues).length}</Typography>
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            <div className="step-footer">
              <Button
                color="inherit"
                onClick={() => {
                  if (isDirty) {
                    setShowExitDialog(true);
                  } else {
                    navigate("/assets");
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                startIcon={<ArrowBackIcon />}
                disabled={activeStep === 0}
                onClick={() => setActiveStep((prev) => prev - 1)}
              >
                Previous
              </Button>

              {activeStep !== 3 ? (
                <Button variant="contained" endIcon={<ArrowForwardIcon />} onClick={handleNext}>
                  Continue
                </Button>
              ) : (
                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
                  {saving ? "Registering..." : "Register Asset"}
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
              fullName={form.asset_name}
              city={form.asset_type}
              mobile={selectedCitizen.full_name || ""}
            />
          </div>
        </div>
      </div>

      <Dialog open={showExitDialog} onClose={() => setShowExitDialog(false)}>
        <DialogTitle>Unsaved Changes</DialogTitle>
        <DialogContent>
          <Typography>
            You have unsaved changes on this page. If you leave now, all entered information will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>Stay</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setShowExitDialog(false);
              navigate("/assets");
            }}
          >
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}