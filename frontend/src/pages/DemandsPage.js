import React, { useEffect, useState } from "react";

import API from "../api/api";

import "../styles/DemandsPage.css";

const DemandsPage = () => {
  const [demands, setDemands] = useState([]);

  const loadDemands = async () => {
    try {
      const response = await API.get("/getDemands");

      setDemands(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadDemands();
  }, []);

  return (
    <div className="demands-page">
      <div className="demands-header">
        <h2>Demand Management</h2>

        <p>Enterprise municipal revenue demand and outstanding management.</p>
      </div>

      <div className="demands-table-card">
        <table className="demands-table">
          <thead>
            <tr>
              <th>#</th>

              <th>Demand No</th>

              <th>Citizen</th>

              <th>Tax Type</th>

              <th>Total</th>

              <th>Paid</th>

              <th>Pending</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {demands.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.demand_number}</td>

                <td>{item.full_name}</td>

                <td>{item.tax_name}</td>

                <td>₹ {item.total_amount}</td>

                <td>₹ {item.paid_amount}</td>

                <td>₹ {item.pending_amount}</td>

                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DemandsPage;
