import React, { useState } from "react";

import API from "../api/api";

import { useRulesContext } from "../context/RulesContext";

import { useTaxContext } from "../context/TaxContext";

import "../styles/RulesPage.css";

const RulesPage = () => {
  const { rules, loadRules } = useRulesContext();

  const { taxTypes } = useTaxContext();

  const [formData, setFormData] = useState({
    tax_type_id: "",

    rule_code: "",

    rule_name: "",

    formula_expression: "",

    output_value: "",

    priority: 1,
  });

  // ====================================
  // HANDLE CHANGE
  // ====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ====================================
  // ADD RULE
  // ====================================

  const handleAddRule = async () => {
    try {
      await API.post("/addRule", formData);

      await loadRules();

      setFormData({
        tax_type_id: "",

        rule_code: "",

        rule_name: "",

        formula_expression: "",

        output_value: "",

        priority: 1,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // ====================================
  // DELETE RULE
  // ====================================

  const handleDeleteRule = async (id) => {
    try {
      await API.delete(`/deleteRule/${id}`);

      await loadRules();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="rules-page">
      <div className="rules-header">
        <h2>Enterprise Rules Engine</h2>

        <p>Dynamic taxation rule management engine.</p>
      </div>

      {/* ============================ */}
      {/* FORM */}
      {/* ============================ */}

      <div className="rules-card">
        <div className="rules-grid">
          <div className="field-group">
            <label>Tax Type</label>

            <select
              name="tax_type_id"
              value={formData.tax_type_id}
              onChange={handleChange}
            >
              <option value="">Select Tax Type</option>

              {taxTypes.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tax_name}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Rule Code</label>

            <input
              type="text"
              name="rule_code"
              placeholder="Enter Rule Code"
              value={formData.rule_code}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Rule Name</label>

            <input
              type="text"
              name="rule_name"
              placeholder="Enter Rule Name"
              value={formData.rule_name}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Formula Expression</label>

            <input
              type="text"
              name="formula_expression"
              placeholder="Example: RATE * AREA"
              value={formData.formula_expression}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Output Value</label>

            <input
              type="number"
              name="output_value"
              placeholder="Enter Output Value"
              value={formData.output_value}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Priority</label>

            <input
              type="number"
              name="priority"
              placeholder="Enter Priority"
              value={formData.priority}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="rules-actions">
          <button className="primary-btn" onClick={handleAddRule}>
            Add Rule
          </button>
        </div>
      </div>

      {/* ============================ */}
      {/* TABLE */}
      {/* ============================ */}

      <div className="rules-table-card">
        <table className="rules-table">
          <thead>
            <tr>
              <th>#</th>

              <th>Rule Code</th>

              <th>Rule Name</th>

              <th>Tax Type</th>

              <th>Formula</th>

              <th>Output</th>

              <th>Priority</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {rules.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.rule_code}</td>

                <td>{item.rule_name}</td>

                <td>{item.tax_name}</td>

                <td>{item.formula_expression}</td>

                <td>{item.output_value}</td>

                <td>{item.priority}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteRule(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RulesPage;
