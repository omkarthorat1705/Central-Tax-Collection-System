import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";
import EnterpriseSectionCard from "../../components/enterprise/EnterpriseSectionCard";

import assetService from "../../services/assetService";
import { getCitizens } from "../../services/citizenService";

export default function EditAssetPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [citizens, setCitizens] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    citizen_id: "",
    asset_name: "",
    asset_type: "",
    asset_address: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [citizenData, assetTypeData, assetResponse] = await Promise.all([
          getCitizens(),
          assetService.getAssetTypes(),
          assetService.getAssetById(id),
        ]);

        setCitizens(citizenData || []);
        setAssetTypes(assetTypeData || []);

        if (assetResponse?.asset) {
          const asset = assetResponse.asset;
          setForm({
            citizen_id: asset.citizen_id || "",
            asset_name: asset.asset_name || "",
            asset_type: asset.asset_type || "",
            asset_address: asset.asset_address || "",
          });
        } else {
          alert("Asset not found");
          navigate("/assets");
        }
      } catch (error) {
        console.error(error);
        alert("Failed to load asset details");
        navigate("/assets");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.citizen_id) {
      newErrors.citizen_id = "Citizen is required";
    }

    if (!form.asset_name?.trim()) {
      newErrors.asset_name = "Asset name is required";
    }

    if (!form.asset_type) {
      newErrors.asset_type = "Asset type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      setSaving(true);
      await assetService.updateAsset(id, form);
      alert("Asset updated successfully");
      navigate(`/assets/view/${id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update asset");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout sidebar={<AdminSidebar />} pageTitle="Edit Asset">
        <Box sx={{ minHeight: "60vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Edit Asset">
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mb: 3 }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(`/assets/view/${id}`)}>
          Cancel
        </Button>

        <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </Box>

      <EnterpriseSectionCard title="Edit Asset" subtitle="Update the asset details and ownership information.">
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
    </AdminLayout>
  );
}
