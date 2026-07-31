import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Checkbox,
  FormControlLabel,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import AdminLayout from "../layouts/AdminLayout";
import AdminSidebar from "../components/AdminSidebar";
import EnterpriseSectionCard from "../components/enterprise/EnterpriseSectionCard";

import API from "../api/api";
import { useTaxContext } from "../context/TaxContext";

export default function ParametersPage() {
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    tax_type_id: "",
    parameter_code: "",
    parameter_name: "",
    parameter_type: "text",
    ui_component: "TEXTFIELD",
    possible_values: "",
    validation_rules: "",
    required_flag: 0,
    display_order: 1,
    asset_type: "",
  });

  const { taxTypes, loadTaxTypes } = useTaxContext();

  const loadData = async () => {
    try {
      const response = await API.get("/getParameters");
      setParameters(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
    loadTaxTypes();
  }, [loadData, loadTaxTypes]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    }));
  };

  const handleAdd = async () => {
    if (!formData.tax_type_id || !formData.parameter_name?.trim()) {
      alert("Tax type and parameter name are required");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/addParameter", formData);
      setFormData({
        tax_type_id: "",
        parameter_code: "",
        parameter_name: "",
        parameter_type: "text",
        ui_component: "TEXTFIELD",
        possible_values: "",
        validation_rules: "",
        required_flag: 0,
        display_order: 1,
        asset_type: "",
      });
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to add parameter");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/deleteParameter/${id}`);
      await loadData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete parameter");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Parameters">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Parameter Management
          </Typography>
          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Define reusable assessment parameters for each tax type.
          </Typography>
        </Box>

        <EnterpriseSectionCard title="Add Parameter" subtitle="Create a new parameter for assessment and tax calculation.">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField select fullWidth label="Tax Type *" name="tax_type_id" value={formData.tax_type_id} onChange={handleChange}>
                {taxTypes.map((tax) => (
                  <MenuItem key={tax.id} value={tax.id}>
                    {tax.tax_name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Parameter Code" name="parameter_code" value={formData.parameter_code} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Parameter Name *" name="parameter_name" value={formData.parameter_name} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField select fullWidth label="Parameter Type" name="parameter_type" value={formData.parameter_type} onChange={handleChange}>
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="number">Number</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="boolean">Boolean</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField select fullWidth label="UI Component" name="ui_component" value={formData.ui_component} onChange={handleChange}>
                <MenuItem value="TEXTFIELD">Text Field</MenuItem>
                <MenuItem value="DROPDOWN">Dropdown</MenuItem>
                <MenuItem value="CHECKBOX">Checkbox</MenuItem>
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Possible Values" name="possible_values" value={formData.possible_values} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Validation Rules" name="validation_rules" value={formData.validation_rules} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth type="number" label="Display Order" name="display_order" value={formData.display_order} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Asset Type" name="asset_type" value={formData.asset_type} onChange={handleChange} />
            </Grid>
          </Grid>

          <FormControlLabel
            control={<Checkbox checked={formData.required_flag === 1} name="required_flag" onChange={handleChange} />}
            label="Required Parameter"
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 2 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd} disabled={submitting}>
              {submitting ? "Saving..." : "Add Parameter"}
            </Button>
          </Box>
        </EnterpriseSectionCard>

        <EnterpriseSectionCard title="Existing Parameters" subtitle="Configured parameter definitions available across the system.">
          <Grid container spacing={2}>
            {parameters.length === 0 ? (
              <Grid size={12}>
                <Typography color="text.secondary">No parameters found.</Typography>
              </Grid>
            ) : (
              parameters.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <Box sx={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 3, p: 2.5, background: "rgba(255,255,255,0.04)" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                      <Box>
                        <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                          {item.parameter_name}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}>
                          {item.parameter_code || "—"}
                        </Typography>
                      </Box>
                      <Chip label={item.required_flag ? "Required" : "Optional"} color={item.required_flag ? "warning" : "default"} size="small" />
                    </Box>
                    <Typography sx={{ color: "#94a3b8", mt: 2 }}>
                      Tax Type: {item.tax_type_id || "—"}
                    </Typography>
                    <Typography sx={{ color: "#94a3b8" }}>
                      Type: {item.parameter_type || "text"}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={() => handleDelete(item.id)} disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        </EnterpriseSectionCard>
      </Box>
    </AdminLayout>
  );
}
