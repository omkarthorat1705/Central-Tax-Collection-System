import React, { useState } from "react";
import "../styles/TaxTypesPage.css";
import { useTaxContext } from "../context/TaxContext";

export default function TaxTypesPage() {
  const [formData, setFormData] = useState({
    tax_code: "",

    tax_name: "",

    description: "",
  });

  const [loading, setLoading] = useState(false);

  // ====================================
  // LOAD TAX TYPES
  // ====================================

  const {
    taxTypes,

    addTaxType,

    deleteTaxType,
  } = useTaxContext();

  // ====================================
  // HANDLE INPUT
  // ====================================

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  // ====================================
  // ADD TAX TYPE
  // ====================================

  const handleAddTaxType = async () => {
    try {
      setLoading(true);

      await addTaxType(formData);

      setFormData({
        tax_code: "",

        tax_name: "",

        description: "",
      });

      

      window.dispatchEvent(new Event("taxTypesUpdated"));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ====================================
  // DELETE TAX TYPE
  // ====================================

  const handleDelete = async (id) => {
    try {
      await deleteTaxType(id);

      
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="tax-page">
      {/* ============================= */}
      {/* TOP SECTION */}
      {/* ============================= */}

      <div className="tax-page-top">
        <div>
          <h2>Tax Types Management</h2>

          <p>
            Configure dynamic taxation modules for municipalities and governance
            entities.
          </p>
        </div>
      </div>

      {/* ============================= */}
      {/* FORM */}
      {/* ============================= */}

      <div className="tax-form-card">
        <div className="tax-form-grid">
          <input
            type="text"
            name="tax_code"
            placeholder="Tax Code"
            value={formData.tax_code}
            onChange={handleChange}
          />

          <input
            type="text"
            name="tax_name"
            placeholder="Tax Name"
            value={formData.tax_name}
            onChange={handleChange}
          />

          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <button
          className="primary-btn"
          onClick={handleAddTaxType}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Tax Type"}
        </button>
      </div>

      {/* ============================= */}
      {/* TABLE */}
      {/* ============================= */}

      <div className="tax-table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>

              <th>Tax Code</th>

              <th>Tax Name</th>

              <th>Description</th>

              <th>Status</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {taxTypes.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-row">
                  No Tax Types Found
                </td>
              </tr>
            ) : (
              taxTypes.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>

                  <td>{item.tax_code || "-"}</td>

                  <td>{item.tax_name}</td>

                  <td>{item.description || "-"}</td>

                  <td>
                    <span className="status-active">Active</span>
                  </td>

                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(item.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
