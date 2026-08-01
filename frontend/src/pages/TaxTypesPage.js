import { useEffect, useState } from "react";
import { Box, Button, Chip, Grid, TextField, Typography } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import AdminLayout from "../layouts/AdminLayout";
import API from "../api/api";
import AdminSidebar from "../components/AdminSidebar";
import EnterpriseSectionCard from "../components/enterprise/EnterpriseSectionCard";

import { useAppData } from "../context/AppDataContext";

export default function TaxTypesPage() {
  const { taxTypes, refreshTaxTypes } = useAppData();

  const [formData, setFormData] = useState({
    tax_code: "",
    tax_name: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    refreshTaxTypes();
  }, [refreshTaxTypes]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTaxType = async () => {
    if (!formData.tax_code?.trim() || !formData.tax_name?.trim()) {
      alert("Tax code and tax name are required");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/addTaxType", formData);
      setFormData({ tax_code: "", tax_name: "", description: "" });
      await refreshTaxTypes();
    } catch (error) {
      console.error(error);
      alert("Failed to add tax type");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await API.delete(`/deleteTaxType/${id}`);
      await refreshTaxTypes();
    } catch (error) {
      console.error(error);
      alert("Failed to delete tax type");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Tax Types">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ color: "white", fontWeight: 700 }}>
            Tax Type Management
          </Typography>
          <Typography sx={{ color: "#94a3b8", mt: 1 }}>
            Configure taxation modules and define the rules that govern assessments.
          </Typography>
        </Box>

        <EnterpriseSectionCard title="Add Tax Type" subtitle="Create a new taxable category for the municipality.">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Tax Code *" name="tax_code" value={formData.tax_code} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Tax Name *" name="tax_name" value={formData.tax_name} onChange={handleChange} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddTaxType} disabled={submitting}>
              {submitting ? "Adding..." : "Add Tax Type"}
            </Button>
          </Box>
        </EnterpriseSectionCard>

        <EnterpriseSectionCard title="Tax Type List" subtitle="Existing tax categories available to the system.">
          <Grid container spacing={2}>
            {taxTypes.length === 0 ? (
              <Grid size={12}>
                <Typography color="text.secondary">No tax types found.</Typography>
              </Grid>
            ) : (
              taxTypes.map((item) => (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <Box
                    sx={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 3,
                      p: 2.5,
                      background: "rgba(255,255,255,0.04)",
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                      <Box>
                        <Typography sx={{ color: "#fff", fontWeight: 700 }}>
                          {item.tax_name}
                        </Typography>
                        <Typography sx={{ color: "#94a3b8", fontSize: 13, mt: 0.5 }}>
                          {item.tax_code || "—"}
                        </Typography>
                      </Box>
                      <Chip label="ACTIVE" color="success" size="small" />
                    </Box>

                    <Typography sx={{ color: "#94a3b8", mt: 2 }}>
                      {item.description || "No description provided."}
                    </Typography>

                    <Box sx={{ mt: 2 }}>
                      <Button
                        color="error"
                        variant="outlined"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                      >
                        {deletingId === item.id ? "Deleting..." : "Delete"}
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

