import React, { useState, useEffect } from "react";

import API from "../api/api";

import "../styles/CitizensPage.css";

import { useCitizensContext } from "../context/CitizensContext";

const CitizensPage = () => {
  const { citizens, loadCitizens } = useCitizensContext();

  const [formData, setFormData] = useState({
    full_name: "",
    mobile_number: "",
    email: "",
    address: "",
    aadhaar_number: "",
    pan_number: "",
    gender: "",
    date_of_birth: "",
    ward_number: "",
    zone_name: "",
    city: "",
    state: "",
    pincode: "",
    occupation: "",
  });

  // ====================================
  // LOAD ONLY ON INITIAL PAGE LOAD
  // ====================================

  useEffect(() => {
    loadCitizens();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  // ADD CITIZEN
  // ====================================

  const handleAddCitizen = async () => {
    try {
      await API.post("/addCitizen", formData);

      // ====================================
      // LIVE REFRESH
      // ====================================

      await loadCitizens();

      // ====================================
      // RESET FORM
      // ====================================

      setFormData({
        full_name: "",
        mobile_number: "",
        email: "",
        address: "",
        aadhaar_number: "",
        pan_number: "",
        gender: "",
        date_of_birth: "",
        ward_number: "",
        zone_name: "",
        city: "",
        state: "",
        pincode: "",
        occupation: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="citizens-page">
      <div className="citizens-header">
        <h2>Citizen Master Registry</h2>

        <p>Enterprise citizen lifecycle and taxation identity management.</p>
      </div>

      {/* ======================== */}
      {/* FORM */}
      {/* ======================== */}

      <div className="citizens-card">
        <div className="citizens-grid">
          <div className="field-group">
            <label>Full Name</label>

            <input
              type="text"
              name="full_name"
              placeholder="Enter Full Name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Mobile Number</label>

            <input
              type="text"
              name="mobile_number"
              placeholder="Enter Mobile Number"
              value={formData.mobile_number}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Email Address</label>

            <input
              type="email"
              name="email"
              placeholder="Enter Email Address"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Aadhaar Number</label>

            <input
              type="text"
              name="aadhaar_number"
              placeholder="Enter Aadhaar Number"
              value={formData.aadhaar_number}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>PAN Number</label>

            <input
              type="text"
              name="pan_number"
              placeholder="Enter PAN Number"
              value={formData.pan_number}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Gender</label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>

              <option value="MALE">Male</option>

              <option value="FEMALE">Female</option>

              <option value="OTHER">Other</option>
            </select>
          </div>

          <div className="field-group">
            <label>Date Of Birth</label>

            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Ward Number</label>

            <input
              type="text"
              name="ward_number"
              placeholder="Enter Ward Number"
              value={formData.ward_number}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Zone Name</label>

            <input
              type="text"
              name="zone_name"
              placeholder="Enter Zone Name"
              value={formData.zone_name}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>City</label>

            <input
              type="text"
              name="city"
              placeholder="Enter City"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>State</label>

            <input
              type="text"
              name="state"
              placeholder="Enter State"
              value={formData.state}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Pincode</label>

            <input
              type="text"
              name="pincode"
              placeholder="Enter Pincode"
              value={formData.pincode}
              onChange={handleChange}
            />
          </div>

          <div className="field-group">
            <label>Occupation</label>

            <input
              type="text"
              name="occupation"
              placeholder="Enter Occupation"
              value={formData.occupation}
              onChange={handleChange}
            />
          </div>

          <div className="field-group full-width">
            <label>Address</label>

            <textarea
              name="address"
              placeholder="Enter Full Address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="citizens-actions">
          <button className="primary-btn" onClick={handleAddCitizen}>
            Register Citizen
          </button>
        </div>
      </div>

      {/* ======================== */}
      {/* TABLE */}
      {/* ======================== */}

      <div className="citizens-table-card">
        <table className="citizens-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Citizen Code</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Ward</th>
              <th>Zone</th>
              <th>City</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {citizens.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.citizen_code}</td>

                <td>{item.full_name}</td>

                <td>{item.mobile_number}</td>

                <td>{item.ward_number}</td>

                <td>{item.zone_name}</td>

                <td>{item.city}</td>

                <td>{item.citizen_status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CitizensPage;
