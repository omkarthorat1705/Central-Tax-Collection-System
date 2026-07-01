import React, { useEffect, useState } from "react";

import API from "../api/api";

import "../styles/AssessmentsPage.css";

const AssessmentsPage = () => {
  const [assets, setAssets] = useState([]);

  const [selectedAsset, setSelectedAsset] = useState("");

  const [financialYear, setFinancialYear] = useState("2026-2027");

  const [generatedAssessments, setGeneratedAssessments] = useState([]);

  // ====================================
  // LOAD ASSETS
  // ====================================

  const loadAssets = async () => {
    try {
      const response = await API.get("/getAssets");

      setAssets(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // ====================================
  // LOAD ASSESSMENTS
  // ====================================

  const loadAssessments = async () => {
    try {
      const response = await API.get("/getAssessments");

      setGeneratedAssessments(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAssets();

    loadAssessments();
  }, []);

  // ====================================
  // GENERATE ASSESSMENT
  // ====================================

  const generateAssessment = async () => {
    try {
      await API.post("/generateAssessment", {
        asset_id: selectedAsset,

        financial_year: financialYear,
      });

      alert("Assessment Generated Successfully");

      loadAssessments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="assessments-page">
      <div className="page-header">
        <h2>Tax Assessments</h2>

        <p>Frozen yearly taxation generation engine.</p>
      </div>

      {/* ================================= */}
      {/* GENERATE */}
      {/* ================================= */}

      <div className="assessment-card">
        <div className="assessment-grid">
          <div className="field-group">
            <label>Select Asset</label>

            <select
              value={selectedAsset}
              onChange={(e) => setSelectedAsset(e.target.value)}
            >
              <option value="">Select Asset</option>

              {assets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.asset_code} - {asset.asset_name}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Financial Year</label>

            <select
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
            >
              <option value="2025-2026">2025-2026</option>

              <option value="2026-2027">2026-2027</option>

              <option value="2027-2028">2027-2028</option>
            </select>
          </div>
        </div>

        <div className="assessment-actions">
          <button className="primary-btn" onClick={generateAssessment}>
            Generate Assessment
          </button>
        </div>
      </div>

      {/* ================================= */}
      {/* TABLE */}
      {/* ================================= */}

      <div className="assessment-table-card">
        <table className="assessment-table">
          <thead>
            <tr>
              <th>#</th>

              <th>Assessment No</th>

              <th>Asset</th>

              <th>Financial Year</th>

              <th>Calculated</th>

              <th>Arrears</th>

              <th>Total</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {generatedAssessments.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.assessment_number}</td>

                <td>{item.asset_name}</td>

                <td>{item.financial_year}</td>

                <td>₹ {item.calculated_amount}</td>

                <td>₹ {item.arrears_amount}</td>

                <td>₹ {item.total_amount}</td>

                <td>{item.assessment_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssessmentsPage;
