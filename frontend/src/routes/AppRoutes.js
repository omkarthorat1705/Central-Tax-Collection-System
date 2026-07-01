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
// import ViewAssetPage from "../pages/assets/ViewAssetPage";
// import EditAssetPage from "../pages/assets/EditAssetPage";
// import AssetParametersPage from "../pages/assets/AssetParametersPage";

// Assessments
// import GenerateAssessmentPage from "../pages/assessments/GenerateAssessmentPage";
// import AssessmentListPage from "../pages/assessments/AssessmentListPage";
// import ViewAssessmentPage from "../pages/assessments/ViewAssessmentPage";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/login" element={<LoginPage />} />

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
{/* 
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

        <Route
          path="/assets/:id/parameters"
          element={
            <ProtectedRoute>
              <AssetParametersPage />
            </ProtectedRoute>
          }
        />

        {/* Assessments */}

        {/* <Route
          path="/assessments"
          element={
            <ProtectedRoute>
              <AssessmentListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessments/generate/:assetId"
          element={
            <ProtectedRoute>
              <GenerateAssessmentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/assessments/view/:id"
          element={
            <ProtectedRoute>
              <ViewAssessmentPage />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;