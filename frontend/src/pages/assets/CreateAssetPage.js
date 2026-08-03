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

const steps = [
  "Asset Details",
  "Tax Assignment",
  "Assessment Parameters",
  "Review",
];

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

  const loadInitialData = async () => {
    try {
      const [citizenData, assetTypeData, taxData] = await Promise.all([
        getCitizens(),
        assetService.getAssetTypes(),
        assetService.getTaxTypes(),
      ]);

      setCitizens(
        Array.isArray(citizenData) ? citizenData : citizenData?.data || [],
      );

      setAssetTypes(
        Array.isArray(assetTypeData)
          ? assetTypeData
          : assetTypeData?.data || [],
      );

      setTaxTypes(Array.isArray(taxData) ? taxData : taxData?.data || []);
    } catch (error) {
      console.error(error);

      setCitizens([]);
      setAssetTypes([]);
      setTaxTypes([]);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleChange = (field, value) => {
    setIsDirty(true);
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTaxSelection = async (taxId) => {
    setIsDirty(true);

    const updatedTaxes = selectedTaxes.includes(Number(taxId))
      ? selectedTaxes.filter((id) => id !== Number(taxId))
      : [...selectedTaxes, Number(taxId)];

    setSelectedTaxes(updatedTaxes);

    try {
      const parameterData = await assetService.getAssetParameters(
        updatedTaxes.map(Number),
      );
      setParameters(Array.isArray(parameterData) ? parameterData : []);
    } catch (error) {
      console.error(error);
      setErrors((prev) => ({
        ...prev,
        taxes: "Unable to load assessment parameters.",
      }));
    }
  };

  const handleParameterChange = (parameterId, value) => {
    setParameterValues((prev) => ({
      ...prev,
      [Number(parameterId)]: value,
    }));
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
        citizen_id: Number(form.citizen_id),
        asset_name: form.asset_name.trim(),
        asset_type_id: Number(form.asset_type),
        asset_address: form.asset_address.trim(),
        tax_type_ids: selectedTaxes.map(Number),
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

  const selectedCitizen =
    citizens.find(
      (citizen) => String(citizen.id) === String(form.citizen_id),
    ) || {};

  const groupedParameters = selectedTaxes
    .map((taxId) => ({
      tax: taxTypes.find((t) => Number(t.id) === Number(taxId)),
      parameters: parameters.filter(
        (p) => Number(p.tax_type_id) === Number(taxId),
      ),
    }))
    .filter((group) => group.tax && group.parameters.length > 0);

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
              <EnterpriseSectionCard
                title="Asset Information"
                subtitle="Register the primary asset details."
              >
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      select
                      fullWidth
                      label="Citizen *"
                      value={form.citizen_id}
                      error={!!errors.citizen_id}
                      helperText={errors.citizen_id}
                      onChange={(event) =>
                        handleChange("citizen_id", event.target.value)
                      }
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
                      onChange={(event) =>
                        handleChange("asset_name", event.target.value)
                      }
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
                      onChange={(event) =>
                        handleChange("asset_type", event.target.value)
                      }
                    >
                      {assetTypes.map((type) => (
                        <MenuItem key={type.id} value={type.id}>
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
                      onChange={(event) =>
                        handleChange("asset_address", event.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 1 && (
              <EnterpriseSectionCard
                title="Applicable Taxes"
                subtitle="Select the tax types that apply to this asset."
              >
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
              <EnterpriseSectionCard
                title="Assessment Parameters"
                subtitle="Capture any tax-specific parameter values."
              >
                <Grid container spacing={3}>
                  {parameters.length === 0 ? (
                    <Grid size={12}>
                      <Typography color="text.secondary">
                        No assessment parameters are available for the selected
                        tax types yet.
                      </Typography>
                    </Grid>
                  ) : (
                    groupedParameters.map((group) => (
                      <Grid size={12} key={group.tax.id}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: "#4dabf7",
                            mb: 2,
                            fontWeight: 700,
                          }}
                        >
                          {group.tax.tax_name}
                        </Typography>

                        <Grid container spacing={3}>
                          {group.parameters.map((parameter) => {
                            const options =
                              parameter.possible_values
                                ?.split(",")
                                .map((x) => x.trim())
                                .filter(Boolean) || [];

                            return (
                              <Grid size={{ xs: 12, md: 6 }} key={parameter.id}>
                                {parameter.ui_component === "CHECKBOX" ? (
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          parameterValues[parameter.id] === true
                                        }
                                        onChange={(e) =>
                                          handleParameterChange(
                                            parameter.id,
                                            e.target.checked,
                                          )
                                        }
                                      />
                                    }
                                    label={parameter.parameter_name}
                                  />
                                ) : parameter.ui_component === "DROPDOWN" ? (
                                  <TextField
                                    select
                                    fullWidth
                                    label={parameter.parameter_name}
                                    value={parameterValues[parameter.id] ?? ""}
                                    onChange={(e) =>
                                      handleParameterChange(
                                        parameter.id,
                                        e.target.value,
                                      )
                                    }
                                  >
                                    {options.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                ) : (
                                  <TextField
                                    fullWidth
                                    type={
                                      parameter.parameter_type === "number"
                                        ? "number"
                                        : "text"
                                    }
                                    label={parameter.parameter_name}
                                    value={parameterValues[parameter.id] ?? ""}
                                    onChange={(e) =>
                                      handleParameterChange(
                                        parameter.id,
                                        e.target.value,
                                      )
                                    }
                                  />
                                )}
                              </Grid>
                            );
                          })}
                        </Grid>
                      </Grid>
                    ))
                  )}
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 3 && (
              <EnterpriseSectionCard
                title="Review & Submit"
                subtitle="Verify the asset registration details before saving."
              >
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <Typography>
                      <strong>Citizen:</strong>{" "}
                      {selectedCitizen.full_name || "Not selected"}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography>
                      <strong>Asset Name:</strong> {form.asset_name}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography>
                      <strong>Asset Type:</strong> Asset Type:
                      {assetTypes.find((x) => x.id === Number(form.asset_type))
                        ?.asset_type_name || "-"}
                    </Typography>
                  </Grid>
                  <Grid size={12}>
                    <Typography>
                      <strong>Selected Taxes:</strong>
                    </Typography>

                    <ul>
                      {taxTypes
                        .filter((tax) => selectedTaxes.includes(tax.id))
                        .map((tax) => (
                          <li key={tax.id}>{tax.tax_name}</li>
                        ))}
                    </ul>
                  </Grid>
                  <Grid size={12}>
                    <Typography>
                      <strong>Assessment Parameters:</strong>{" "}
                      {Object.keys(parameterValues).length}
                    </Typography>
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
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={handleNext}
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
              city={
                assetTypes.find((item) => item.id === Number(form.asset_type))
                  ?.asset_type_name || ""
              }
              mobile={selectedCitizen.full_name || ""}
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
