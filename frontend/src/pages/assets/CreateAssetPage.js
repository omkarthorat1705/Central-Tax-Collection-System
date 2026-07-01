import "../../styles/CreateCitizenPage.css";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const citizenData = await getCitizens();

      const assetTypeData =
        await assetService.getAssetTypes();

      const taxData =
        await assetService.getTaxTypes();

      setCitizens(citizenData || []);
      setAssetTypes(assetTypeData || []);
      setTaxTypes(taxData || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (field, value) => {
    setIsDirty(true);

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTaxSelection = async (taxId) => {
    let updatedTaxes = [];

    if (selectedTaxes.includes(taxId)) {
      updatedTaxes = selectedTaxes.filter(
        (id) => id !== taxId,
      );
    } else {
      updatedTaxes = [...selectedTaxes, taxId];
    }

    setSelectedTaxes(updatedTaxes);

    try {
      const parameterData =
        await assetService.getAssetParameters(
          updatedTaxes,
        );

      setParameters(parameterData || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleParameterChange = (
    parameterId,
    value,
  ) => {
    setParameterValues((prev) => ({
      ...prev,
      [parameterId]: value,
    }));
  };

  const calculateProgress = () => {
    let completed = 0;

    if (form.citizen_id) completed++;
    if (form.asset_name) completed++;
    if (form.asset_type) completed++;
    if (form.asset_address) completed++;

    return (completed / 4) * 100;
  };

  const progress = calculateProgress();

  const validateCurrentStep = () => {
    const newErrors = {};

    if (activeStep === 0) {
      if (!form.citizen_id) {
        newErrors.citizen_id =
          "Citizen is required";
      }

      if (!form.asset_name) {
        newErrors.asset_name =
          "Asset Name is required";
      }

      if (!form.asset_type) {
        newErrors.asset_type =
          "Asset Type is required";
      }
    }

    if (activeStep === 1) {
      if (selectedTaxes.length === 0) {
        alert(
          "Please select at least one tax type",
        );

        return false;
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    setActiveStep((prev) => prev + 1);
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await assetService.createAsset({
        ...form,
        tax_type_ids: selectedTaxes,
        parameter_values: parameterValues,
      });

      alert(
        "Asset Registered Successfully",
      );

      navigate("/assets");
    } catch (error) {
      console.error(error);

      alert(
        "Failed to register asset",
      );
    } finally {
      setSaving(false);
    }
  };

  const selectedCitizen =
    citizens.find(
      (c) =>
        String(c.id) ===
        String(form.citizen_id),
    ) || {};

  return (
    <AdminLayout
      sidebar={<AdminSidebar />}
      pageTitle="Asset Registration"
    >
      <div className="citizen-page">
        <div className="citizen-header">
          <div className="citizen-title">
            Asset Registration
          </div>

          <div className="citizen-subtitle">
            Register citizen assets
            and map applicable tax
            types for assessment.
          </div>
        </div>

        <EnterpriseSectionCard>
          <Stepper
            activeStep={activeStep}
            className="enterprise-stepper"
          >
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>
                  {step}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </EnterpriseSectionCard>

        <div className="citizen-body">
          <div className="citizen-form">

            {activeStep === 0 && (
              <EnterpriseSectionCard
                title="Asset Information"
                subtitle="Register asset details"
              >
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <TextField
                      select
                      fullWidth
                      label="Citizen *"
                      value={
                        form.citizen_id
                      }
                      error={
                        !!errors.citizen_id
                      }
                      helperText={
                        errors.citizen_id
                      }
                      onChange={(e) =>
                        handleChange(
                          "citizen_id",
                          e.target.value,
                        )
                      }
                    >
                      {citizens.map(
                        (citizen) => (
                          <MenuItem
                            key={
                              citizen.id
                            }
                            value={
                              citizen.id
                            }
                          >
                            {
                              citizen.citizen_code
                            }
                            {" - "}
                            {
                              citizen.full_name
                            }
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label="Asset Name *"
                      value={
                        form.asset_name
                      }
                      error={
                        !!errors.asset_name
                      }
                      helperText={
                        errors.asset_name
                      }
                      onChange={(e) =>
                        handleChange(
                          "asset_name",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      select
                      fullWidth
                      label="Asset Type *"
                      value={
                        form.asset_type
                      }
                      error={
                        !!errors.asset_type
                      }
                      helperText={
                        errors.asset_type
                      }
                      onChange={(e) =>
                        handleChange(
                          "asset_type",
                          e.target.value,
                        )
                      }
                    >
                      {assetTypes.map(
                        (type) => (
                          <MenuItem
                            key={
                              type.id
                            }
                            value={
                              type.asset_type_name
                            }
                          >
                            {
                              type.asset_type_name
                            }
                          </MenuItem>
                        ),
                      )}
                    </TextField>
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Asset Address"
                      value={
                        form.asset_address
                      }
                      onChange={(e) =>
                        handleChange(
                          "asset_address",
                          e.target.value,
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 1 && (
              <EnterpriseSectionCard
                title="Applicable Taxes"
                subtitle="Select tax types"
              >
                <Grid container spacing={2}>
                  {taxTypes.map(
                    (tax) => (
                      <Grid
                        size={{
                          xs: 12,
                          md: 6,
                        }}
                        key={tax.id}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={selectedTaxes.includes(
                                tax.id,
                              )}
                              onChange={() =>
                                handleTaxSelection(
                                  tax.id,
                                )
                              }
                            />
                          }
                          label={
                            tax.tax_name
                          }
                        />
                      </Grid>
                    ),
                  )}
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 2 && (
              <EnterpriseSectionCard
                title="Assessment Parameters"
                subtitle="Dynamic fields from tax configuration"
              >
                <Grid container spacing={3}>
                  {parameters.map(
                    (
                      parameter,
                    ) => {
                      const options =
                        parameter.possible_values
                          ?.split(",")
                          .map((v) =>
                            v.trim(),
                          ) || [];

                      if (
                        parameter.ui_component ===
                        "DROPDOWN"
                      ) {
                        return (
                          <Grid
                            size={{
                              xs: 12,
                              md: 6,
                            }}
                            key={
                              parameter.id
                            }
                          >
                            <TextField
                              select
                              fullWidth
                              label={
                                parameter.parameter_name
                              }
                              onChange={(
                                e,
                              ) =>
                                handleParameterChange(
                                  parameter.id,
                                  e
                                    .target
                                    .value,
                                )
                              }
                            >
                              {options.map(
                                (
                                  item,
                                  index,
                                ) => (
                                  <MenuItem
                                    key={
                                      index
                                    }
                                    value={
                                      item
                                    }
                                  >
                                    {
                                      item
                                    }
                                  </MenuItem>
                                ),
                              )}
                            </TextField>
                          </Grid>
                        );
                      }

                      return (
                        <Grid
                          size={{
                            xs: 12,
                            md: 6,
                          }}
                          key={
                            parameter.id
                          }
                        >
                          <TextField
                            fullWidth
                            label={
                              parameter.parameter_name
                            }
                            onChange={(
                              e,
                            ) =>
                              handleParameterChange(
                                parameter.id,
                                e.target
                                  .value,
                              )
                            }
                          />
                        </Grid>
                      );
                    },
                  )}
                </Grid>
              </EnterpriseSectionCard>
            )}

            {activeStep === 3 && (
              <EnterpriseSectionCard
                title="Review & Submit"
                subtitle="Verify asset information"
              >
                <Typography>
                  <strong>
                    Citizen:
                  </strong>{" "}
                  {
                    selectedCitizen.full_name
                  }
                </Typography>

                <Typography>
                  <strong>
                    Asset Name:
                  </strong>{" "}
                  {form.asset_name}
                </Typography>

                <Typography>
                  <strong>
                    Asset Type:
                  </strong>{" "}
                  {form.asset_type}
                </Typography>

                <Typography>
                  <strong>
                    Selected Taxes:
                  </strong>{" "}
                  {
                    selectedTaxes.length
                  }
                </Typography>
              </EnterpriseSectionCard>
            )}

            <div className="step-footer">
              <Button
                color="inherit"
                onClick={() => {
                  if (isDirty) {
                    setShowExitDialog(
                      true,
                    );
                  } else {
                    navigate("/assets");
                  }
                }}
              >
                Cancel
              </Button>

              <Button
                startIcon={
                  <ArrowBackIcon />
                }
                disabled={
                  activeStep === 0
                }
                onClick={() =>
                  setActiveStep(
                    activeStep - 1,
                  )
                }
              >
                Previous
              </Button>

              {activeStep !== 3 ? (
                <Button
                  variant="contained"
                  endIcon={
                    <ArrowForwardIcon />
                  }
                  onClick={
                    handleNext
                  }
                >
                  Continue
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={
                    <SaveIcon />
                  }
                  onClick={
                    handleSave
                  }
                  disabled={
                    saving
                  }
                >
                  {saving
                    ? "Registering..."
                    : "Register Asset"}
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
              mobile={
                selectedCitizen.full_name ||
                ""
              }
            />
          </div>
        </div>
      </div>

      <Dialog
        open={showExitDialog}
        onClose={() =>
          setShowExitDialog(false)
        }
      >
        <DialogTitle>
          Unsaved Changes
        </DialogTitle>

        <DialogContent>
          <Typography>
            You have unsaved
            changes. Leaving this
            page will discard
            them.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setShowExitDialog(
                false,
              )
            }
          >
            Stay
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={() =>
              navigate("/assets")
            }
          >
            Leave Page
          </Button>
        </DialogActions>
      </Dialog>
    </AdminLayout>
  );
}