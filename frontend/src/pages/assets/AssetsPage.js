import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, TextField, MenuItem } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import CalculateIcon from "@mui/icons-material/Calculate";
import RefreshIcon from "@mui/icons-material/Refresh";

import AdminLayout from "../../layouts/AdminLayout";
import AdminSidebar from "../../components/AdminSidebar";
import EnterpriseSectionCard from "../../components/enterprise/EnterpriseSectionCard";

import API from "../../api/api";

import "../../styles/AssetsPage.css";

export default function AssetsPage() {
  const navigate = useNavigate();

  const [assets, setAssets] = useState([]);

  const [search, setSearch] = useState("");
  const [assetTypeFilter, setAssetTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadAssets = async () => {
    try {
      const response = await API.get("/assets/getAssets");

      setAssets(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const totalAssets = assets.length;

  const activeAssets = assets.filter((item) => item.status === "ACTIVE").length;

  const inactiveAssets = totalAssets - activeAssets;

  const filteredAssets = assets.filter((item) => {
    const matchesSearch =
      item.asset_code?.toLowerCase().includes(search.toLowerCase()) ||
      item.asset_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.citizen_name?.toLowerCase().includes(search.toLowerCase());

    const matchesType = !assetTypeFilter || item.asset_type === assetTypeFilter;

    const matchesStatus = !statusFilter || item.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const columns = [
    {
      field: "asset_code",
      headerName: "Asset Code",
      flex: 1,
    },
    {
      field: "citizen_name",
      headerName: "Citizen",
      flex: 1.5,
    },
    {
      field: "asset_type",
      headerName: "Asset Type",
      flex: 1,
    },
    {
      field: "asset_name",
      headerName: "Asset Name",
      flex: 1.5,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 2.5,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            size="small"
            startIcon={<VisibilityIcon />}
            onClick={() => navigate(`/assets/view/${params.row.id}`)}
          >
            View{" "}
          </Button>

          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/assets/edit/${params.row.id}`)}
          >
            Edit
          </Button>

          <Button
            size="small"
            variant="contained"
            onClick={() => navigate(`/assets/${params.row.id}/parameters`)}
          >
            Parameters
          </Button>

          <Button
            size="small"
            color="success"
            variant="contained"
            startIcon={<CalculateIcon />}
            onClick={() => navigate(`/assessments/generate/${params.row.id}`)}
          >
            Assess
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout sidebar={<AdminSidebar />} pageTitle="Assets">
      {" "}
      <div className="assets-page">
        {" "}
        <div className="assets-header">
          {" "}
          <div>
            {" "}
            <div className="assets-title">Asset Management </div>
            <div className="assets-subtitle">
              Register and manage taxable assets.
            </div>
          </div>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/assets/create")}
          >
            Register Asset
          </Button>
        </div>
        <div className="asset-summary-cards">
          <div className="asset-stat-card">
            <div className="asset-stat-title">Total Assets</div>

            <div className="asset-stat-value">{totalAssets}</div>
          </div>

          <div className="asset-stat-card">
            <div className="asset-stat-title">Active Assets</div>

            <div className="asset-stat-value">{activeAssets}</div>
          </div>

          <div className="asset-stat-card">
            <div className="asset-stat-title">Inactive Assets</div>

            <div className="asset-stat-value">{inactiveAssets}</div>
          </div>
        </div>
        <EnterpriseSectionCard>
          <div className="assets-toolbar">
            <TextField
              size="small"
              label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <TextField
              select
              size="small"
              label="Asset Type"
              value={assetTypeFilter}
              onChange={(e) => setAssetTypeFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>

              {[...new Set(assets.map((asset) => asset.asset_type))].map(
                (type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ),
              )}
            </TextField>

            <TextField
              select
              size="small"
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>

              <MenuItem value="ACTIVE">Active</MenuItem>

              <MenuItem value="INACTIVE">Inactive</MenuItem>
            </TextField>

            <Button startIcon={<RefreshIcon />} onClick={loadAssets}>
              Refresh
            </Button>
          </div>

          <div className="assets-grid">
            <DataGrid
              rows={filteredAssets}
              columns={columns}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          </div>
        </EnterpriseSectionCard>
      </div>
    </AdminLayout>
  );
}
