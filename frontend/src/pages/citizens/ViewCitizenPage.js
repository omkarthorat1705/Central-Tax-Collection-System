import { useEffect, useState } from "react";

import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Chip,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";

import { useNavigate, useParams } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";

import EnterpriseSectionCard from "../../components/enterprise/EnterpriseSectionCard";
import EnterpriseSummaryPanel from "../../components/enterprise/EnterpriseSummaryPanel";

import { getCitizenById } from "../../services/citizenService";

export default function ViewCitizenPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [citizen, setCitizen] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadCitizen = async () => {
    try {
      const data = await getCitizenById(id);
      setCitizen(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadCitizen();
}, [id]);

//   const loadCitizen = async () => {
//     try {
//       const data = await getCitizenById(id);
//       setCitizen(data);
//     } catch (error) {
//       console.error("Error loading citizen:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

  if (loading) {
    return (
      <AdminLayout sidebar={<AdminSidebar />} pageTitle="View Citizen">
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  if (!citizen) {
    return (
      <AdminLayout sidebar={<AdminSidebar />} pageTitle="View Citizen">
        <Typography color="error">Citizen record not found.</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Citizen Details">
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid size={{ xs: 12, lg: 9 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mb: 3,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/citizens")}
            >
              Back
            </Button>

            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/citizens/edit/${id}`)}
            >
              Edit Citizen
            </Button>
            <Button color="warning">Deactivate Citizen</Button>
          </Box>

          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid size={12}>
              <EnterpriseSectionCard>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="h4" fontWeight={700}>
                      {citizen.full_name}
                    </Typography>

                    <Typography color="#94a3b8">
                      {citizen.citizen_code}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Chip
                      label={citizen.citizen_status}
                      color={
                        citizen.citizen_status === "ACTIVE"
                          ? "success"
                          : "error"
                      }
                    />

                    <Chip
                      label={citizen.verification_status}
                      color={
                        citizen.verification_status === "VERIFIED"
                          ? "success"
                          : "warning"
                      }
                    />
                  </Box>
                </Box>
              </EnterpriseSectionCard>
              <EnterpriseSectionCard
                title="Personal Information"
                subtitle="Basic citizen details"
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField label="Full Name" value={citizen.full_name} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Citizen Code"
                      value={citizen.citizen_code}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField label="Gender" value={citizen.gender} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Date of Birth"
                      value={citizen.date_of_birth}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField label="Occupation" value={citizen.occupation} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Citizen Type"
                      value={citizen.citizen_type}
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
              <Grid size={12}>
                <EnterpriseSectionCard
                  title="Identity Information"
                  subtitle="Government identity details"
                ></EnterpriseSectionCard>
              </Grid>
            </Grid>

            {/* Contact Information */}
            <Grid size={12}>
              <EnterpriseSectionCard
                title="Contact Information"
                subtitle="Communication details"
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Mobile Number"
                      value={citizen.mobile_number}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Alternate Mobile"
                      value={citizen.alternate_mobile}
                    />
                  </Grid>

                  <Grid size={12}>
                    <InfoField label="Email Address" value={citizen.email} />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            </Grid>

            {/* Address Information */}
            <Grid size={12}>
              <EnterpriseSectionCard
                title="Address Information"
                subtitle="Residential details"
              >
                <Grid container spacing={3}>
                  <Grid size={12}>
                    <InfoField
                      label="Address Line 1"
                      value={citizen.address_line_1}
                    />
                  </Grid>

                  <Grid size={12}>
                    <InfoField
                      label="Address Line 2"
                      value={citizen.address_line_2}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField label="Locality" value={citizen.locality} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField label="Landmark" value={citizen.landmark} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <InfoField
                      label="Ward Number"
                      value={citizen.ward_number}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <InfoField label="Zone Name" value={citizen.zone_name} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <InfoField label="Pincode" value={citizen.pincode} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <InfoField label="City" value={citizen.city} />
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <InfoField label="State" value={citizen.state} />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            </Grid>

            {/* Emergency Contact */}
            <Grid size={12}>
              <EnterpriseSectionCard
                title="Emergency Contact"
                subtitle="Emergency contact information"
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Contact Name"
                      value={citizen.emergency_contact_name}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <InfoField
                      label="Contact Mobile"
                      value={citizen.emergency_contact_mobile}
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            </Grid>

            {/* Communication Preferences */}
            <Grid size={12}>
              <EnterpriseSectionCard
                title="Communication Preferences"
                subtitle="Citizen notification settings"
              >
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 3 }}>
                    <InfoField
                      label="SMS"
                      value={citizen.communication_sms ? "Enabled" : "Disabled"}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <InfoField
                      label="Email"
                      value={
                        citizen.communication_email ? "Enabled" : "Disabled"
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <InfoField
                      label="WhatsApp"
                      value={
                        citizen.communication_whatsapp ? "Enabled" : "Disabled"
                      }
                    />
                  </Grid>

                  <Grid size={{ xs: 12, md: 3 }}>
                    <InfoField
                      label="Post"
                      value={
                        citizen.communication_post ? "Enabled" : "Disabled"
                      }
                    />
                  </Grid>
                </Grid>
              </EnterpriseSectionCard>
            </Grid>
          </Grid>
        </Grid>

        {/* Summary Panel */}
        <Grid size={{ xs: 12, lg: 3 }}>
          <EnterpriseSummaryPanel
            progress={100}
            citizenCode={citizen.citizen_code}
            status={citizen.citizen_status}
            verification={citizen.verification_status}
            fullName={citizen.full_name}
            mobile={citizen.mobile_number}
            city={citizen.city}
            citizenType={citizen.citizen_type}
          />
        </Grid>
        <Grid size={12}>
          <EnterpriseSectionCard
            title="Audit Information"
            subtitle="Record lifecycle information"
          ></EnterpriseSectionCard>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}

function InfoField({ label, value }) {
  return (
    <Box>
      <Typography
        sx={{
          color: "#94a3b8",
          fontSize: ".85rem",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          color: "white",
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </Typography>
    </Box>
  );
}
