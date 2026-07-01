import { useEffect, useState } from "react";

import API from "../api/api";

import "../styles/ParametersPage.css";
import { useTaxContext } from "../context/TaxContext";

export default function ParametersPage() {
  const [parameters, setParameters] = useState([]);

  const [formData, setFormData] = useState({
    tax_type_id: "",

    parameter_code: "",

    parameter_name: "",

    data_type: "text",

    ui_type: "input",

    possible_values: "",

    default_value: "",

    validation_rule: "",

    required_flag: 0,

    display_order: 1,
  });

  // ================================
  // LOAD INITIAL DATA
  // ================================

  const loadData = async () => {
    try {
      const paramRes = await API.get("/getParameters");
      setParameters(paramRes.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const { taxTypes } = useTaxContext();

  useEffect(() => {
    loadData();

    const refreshHandler = () => {
      loadData();
    };

    window.addEventListener("taxTypesUpdated", refreshHandler);

    return () => {
      window.removeEventListener("taxTypesUpdated", refreshHandler);
    };
  }, []);

  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,

      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // ================================
  // ADD PARAMETER
  // ================================

  const handleAdd = async () => {
    try {
      await API.post("/addParameter", formData);

      setFormData({
        tax_type_id: "",

        parameter_code: "",

        parameter_name: "",

        data_type: "text",

        ui_type: "input",

        possible_values: "",

        default_value: "",

        validation_rule: "",

        required_flag: 0,

        display_order: 1,
      });

      await loadData();
    } catch (error) {
      console.error(error);
    }
  };

  // ================================
  // DELETE
  // ================================

  const handleDelete = async (id) => {
    try {
      await API.delete(`/deleteParameter/${id}`);

      loadData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="param-page">
      <div className="page-title">
        <h2>Parameters Engine</h2>

        <p>Configure metadata-driven taxation parameters.</p>
      </div>

      {/* ========================= */}
      {/* FORM */}
      {/* ========================= */}

      <div className="param-form-card">
        <div className="param-grid">
          <select
            name="tax_type_id"
            value={formData.tax_type_id}
            onChange={handleChange}
          >
            <option value="">Select Tax Type</option>

            {taxTypes.map((tax) => (
              <option key={tax.id} value={tax.id}>
                {tax.tax_name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="parameter_code"
            placeholder="Parameter Code"
            value={formData.parameter_code}
            onChange={handleChange}
          />

          <input
            type="text"
            name="parameter_name"
            placeholder="Parameter Name"
            value={formData.parameter_name}
            onChange={handleChange}
          />

          <select
            name="data_type"
            value={formData.data_type}
            onChange={handleChange}
          >
            <option value="text">Text</option>

            <option value="number">Number</option>

            <option value="date">Date</option>

            <option value="boolean">Boolean</option>
          </select>

          <select
            name="ui_type"
            value={formData.ui_type}
            onChange={handleChange}
          >
            <option value="input">Input</option>

            <option value="dropdown">Dropdown</option>

            <option value="radio">Radio</option>
          </select>

          <input
            type="text"
            name="possible_values"
            placeholder="Possible Values"
            value={formData.possible_values}
            onChange={handleChange}
          />

          <input
            type="text"
            name="default_value"
            placeholder="Default Value"
            value={formData.default_value}
            onChange={handleChange}
          />

          <input
            type="text"
            name="validation_rule"
            placeholder="Validation Rule"
            value={formData.validation_rule}
            onChange={handleChange}
          />

          <input
            type="number"
            name="display_order"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={handleChange}
          />
        </div>

        <div className="checkbox-row">
          <label>
            <input
              type="checkbox"
              name="required_flag"
              checked={formData.required_flag === 1}
              onChange={handleChange}
            />
            Required Parameter
          </label>
        </div>

        <button className="primary-btn" onClick={handleAdd}>
          Add Parameter
        </button>
      </div>

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <div className="param-table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>

              <th>Tax Type</th>

              <th>Code</th>

              <th>Name</th>

              <th>Data Type</th>

              <th>UI Type</th>

              <th>Required</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {parameters.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.tax_name}</td>

                <td>{item.parameter_code}</td>

                <td>{item.parameter_name}</td>

                <td>{item.data_type}</td>

                <td>{item.ui_type}</td>

                <td>{item.required_flag ? "YES" : "NO"}</td>

                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item.id)}
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
}
