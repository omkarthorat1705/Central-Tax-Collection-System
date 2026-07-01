import { useEffect, useState } from "react";

import {
  Box,
  Button,
  // Typography,
  TextField,
  InputAdornment,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";

import { DataGrid } from "@mui/x-data-grid";

import { useNavigate } from "react-router-dom";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";

import { getCitizens } from "../../services/citizenService";

export default function CitizenListPage() {
  const navigate = useNavigate();

  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    loadCitizens();
  }, []);

  const loadCitizens = async () => {
    try {
      const data = await getCitizens();

      setCitizens(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = citizens
    .filter((citizen) => {
      const searchMatch =
        citizen.full_name?.toLowerCase().includes(search.toLowerCase()) ||
        citizen.citizen_code?.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        !statusFilter || citizen.citizen_status === statusFilter;

      return searchMatch && statusMatch;
    })
    .map((citizen) => ({
      id: citizen.id,
      citizen_code: citizen.citizen_code,
      full_name: citizen.full_name,
      mobile_number: citizen.mobile_number,
      email: citizen.email,
      city: citizen.city,
      status: citizen.citizen_status,
    }));

  const columns = [
    {
      field: "citizen_code",
      headerName: "Citizen Code",
      flex: 1.2,
    },
    {
      field: "full_name",
      headerName: "Citizen Name",
      flex: 1.5,
    },
    {
      field: "mobile_number",
      headerName: "Mobile Number",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1.5,
    },
    {
      field: "city",
      headerName: "City",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            alignItems: "center",
            mb: 3,
          }}
        >
          <VisibilityIcon
            sx={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/citizens/view/${params.row.id}`)}
          />

          <EditIcon
            sx={{
              cursor: "pointer",
            }}
            onClick={() => navigate(`/citizens/edit/${params.row.id}`)}
          />
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Citizen Management">
      <Box
        sx={{
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",

          border: "1px solid rgba(255,255,255,0.08)",

          backdropFilter: "blur(20px)",

          borderRadius: 4,

          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder="Search Citizen..."
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                minWidth: 320,

                "& .MuiOutlinedInput-root": {
                  color: "white",

                  "& fieldset": {
                    borderColor: "rgba(255,255,255,0.15)",
                  },

                  "&:hover fieldset": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                },

                "& input::placeholder": {
                  color: "#94a3b8",
                  opacity: 1,
                },
              }}
              inputprops={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94a3b8" }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{
                minWidth: 180,
              }}
            >
              <MenuItem value="">All</MenuItem>

              <MenuItem value="ACTIVE">Active</MenuItem>

              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/citizens/create")}
          >
            Create Citizen
          </Button>
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={columns}
          loading={loading}
          rowHeight={44}
          columnHeaderHeight={48}
          pageSizeOptions={[10, 25, 50]}
          autoHeight
          disableRowSelectionOnClick
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          sx={{
            border: "none",

            color: "white",

            "& .MuiDataGrid-columnHeaders": {
              background: "#111827",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
            },

            "& .MuiDataGrid-row": {
              background: "transparent",
            },

            "& .MuiDataGrid-row:hover": {
              background: "rgba(255,255,255,0.05)",
            },

            "& .Mui-selected": {
              background: "rgba(37,99,235,0.25) !important",
            },

            "& .MuiDataGrid-cell": {
              borderColor: "rgba(255,255,255,0.08)",
            },

            "& .MuiDataGrid-footerContainer": {
              color: "white",
            },
          }}
        />
      </Box>
    </AdminLayout>
  );
}
