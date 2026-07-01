import React, { useEffect, useState } from "react";

import API from "../api/api";

import "../styles/ReportsPage.css";

const ReportsPage = () => {
  const [summary, setSummary] = useState({
    total_assessment: 0,

    total_collection: 0,

    total_pending: 0,

    partial_cases: 0,
  });

  const [wardCollection, setWardCollection] = useState([]);

  const [taxCollection, setTaxCollection] = useState([]);

  // =====================================
  // LOAD REPORTS
  // =====================================

  const loadReports = async () => {
    try {
      // ===========================
      // SUMMARY
      // ===========================

      const summaryResponse = await API.get("/getRevenueSummary");

      setSummary(summaryResponse.data.data);

      // ===========================
      // WARD COLLECTION
      // ===========================

      const wardResponse = await API.get("/getWardWiseCollection");

      setWardCollection(wardResponse.data.data || []);

      // ===========================
      // TAX COLLECTION
      // ===========================

      const taxResponse = await API.get("/getTaxWiseCollection");

      setTaxCollection(taxResponse.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="reports-page">
      <div className="page-header">
        <h2>Revenue Analytics & Reports</h2>

        <p>Enterprise municipal analytics and revenue intelligence.</p>
      </div>

      {/* ========================= */}
      {/* SUMMARY */}
      {/* ========================= */}

      <div className="report-grid">
        <div className="report-card">
          <h3>Total Assessments</h3>

          <h2>₹ {summary.total_assessment || 0}</h2>
        </div>

        <div className="report-card">
          <h3>Total Collections</h3>

          <h2>₹ {summary.total_collection || 0}</h2>
        </div>

        <div className="report-card">
          <h3>Pending Dues</h3>

          <h2>₹ {summary.total_pending || 0}</h2>
        </div>

        <div className="report-card">
          <h3>Partial Payments</h3>

          <h2>{summary.partial_cases || 0}</h2>
        </div>
      </div>

      {/* ========================= */}
      {/* WARD COLLECTION */}
      {/* ========================= */}

      <div className="table-card">
        <h3>Ward Wise Collection</h3>

        <table className="report-table">
          <thead>
            <tr>
              <th>Ward</th>

              <th>Total Collection</th>
            </tr>
          </thead>

          <tbody>
            {wardCollection.map((item, index) => (
              <tr key={index}>
                <td>{item.ward_number}</td>

                <td>₹ {item.total_collection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================= */}
      {/* TAX COLLECTION */}
      {/* ========================= */}

      <div className="table-card">
        <h3>Tax Type Collection</h3>

        <table className="report-table">
          <thead>
            <tr>
              <th>Tax Type</th>

              <th>Total Collection</th>
            </tr>
          </thead>

          <tbody>
            {taxCollection.map((item, index) => (
              <tr key={index}>
                <td>{item.tax_name}</td>

                <td>₹ {item.total_collection}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsPage;
