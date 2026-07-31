import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "../pages/landing/LandingPage";
import LoginPage from "../pages/auth/LoginPage";
import AdminDashboard from "../pages/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";

// Citizens
import CitizenManagementPage from "../pages/citizens/CitizenListPage";
import CreateCitizenPage from "../pages/citizens/CreateCitizenPage";
import ViewCitizenPage from "../pages/citizens/ViewCitizenPage";
import EditCitizenPage from "../pages/citizens/EditCitizenPage";

// Assets
import AssetsPage from "../pages/assets/AssetsPage";
import CreateAssetPage from "../pages/assets/CreateAssetPage";
import ViewAssetPage from "../pages/assets/ViewAssetPage";
import EditAssetPage from "../pages/assets/EditAssetPage";
// import AssetParametersPage from "../pages/assets/AssetParametersPage";

// Tax Types
import TaxTypesPage from "../pages/TaxTypesPage";

// Parameters
import ParametersPage from "../pages/ParametersPage";

// Assessments
import AssessmentsPage from "../pages/AssessmentsPage";

// Payments
import PaymentsPage from "../pages/PaymentsPage";

// Reports
import ReportsPage from "../pages/ReportsPage";

// Demands
import DemandsPage from "../pages/DemandsPage";

// Citizen Portal
import CitizenPortalPage from "../pages/citizen/CitizenPortalPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

        <Route path="/citizen-portal" element={<CitizenPortalPage />} />

        {/* Dashboard */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Citizens */}

        <Route
          path="/citizens"
          element={
            <ProtectedRoute>
              <CitizenManagementPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizens/create"
          element={
            <ProtectedRoute>
              <CreateCitizenPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizens/view/:id"
          element={
            <ProtectedRoute>
              <ViewCitizenPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/citizens/edit/:id"
          element={
            <ProtectedRoute>
              <EditCitizenPage />
            </ProtectedRoute>
          }
        />

        {/* Assets */}

        <Route
          path="/assets"
          element={
            <ProtectedRoute>
              <AssetsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/create"
          element={
            <ProtectedRoute>
              <CreateAssetPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/view/:id"
          element={
            <ProtectedRoute>
              <ViewAssetPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assets/edit/:id"
          element={
            <ProtectedRoute>
              <EditAssetPage />
            </ProtectedRoute>
          }
        />

        {/* Tax Types */}

        <Route
          path="/tax-types"
          element={
            <ProtectedRoute>
              <TaxTypesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tax-config"
          element={
            <ProtectedRoute>
              <TaxTypesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/parameters"
          element={
            <ProtectedRoute>
              <ParametersPage />
            </ProtectedRoute>
          }
        />

        {/* Assessments */}

        <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <AssessmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessments/generate/:assetId"
          element={
            <ProtectedRoute>
              <AssessmentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <ReportsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/demands"
          element={
            <ProtectedRoute>
              <DemandsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;