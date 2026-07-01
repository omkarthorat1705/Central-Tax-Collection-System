import React, { useEffect, useState } from "react";

import API from "../api/api";

import "../styles/PaymentsPage.css";

const PaymentsPage = () => {
  const [assessments, setAssessments] = useState([]);

  const [selectedAssessment, setSelectedAssessment] = useState("");

  const [paymentAmount, setPaymentAmount] = useState("");

  const [paymentMode, setPaymentMode] = useState("CASH");

  const [payments, setPayments] = useState([]);

  // =====================================
  // LOAD ASSESSMENTS
  // =====================================

  const loadAssessments = async () => {
    try {
      const response = await API.get("/getAssessments");

      setAssessments(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // =====================================
  // LOAD PAYMENTS
  // =====================================

  const loadPayments = async () => {
    try {
      const response = await API.get("/getPayments");

      setPayments(response.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadAssessments();

    loadPayments();
  }, []);

  // =====================================
  // MAKE PAYMENT
  // =====================================

  const makePayment = async () => {
    try {
      await API.post("/makePayment", {
        assessment_id: selectedAssessment,

        payment_amount: paymentAmount,

        payment_mode: paymentMode,
      });

      alert("Payment Collected Successfully");

      setPaymentAmount("");

      loadPayments();

      loadAssessments();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="payments-page">
      <div className="page-header">
        <h2>Revenue Collections</h2>

        <p>Municipal payment collection engine.</p>
      </div>

      {/* ============================== */}
      {/* PAYMENT FORM */}
      {/* ============================== */}

      <div className="payment-card">
        <div className="payment-grid">
          <div className="field-group">
            <label>Select Assessment</label>

            <select
              value={selectedAssessment}
              onChange={(e) => setSelectedAssessment(e.target.value)}
            >
              <option value="">Select Assessment</option>

              {assessments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.assessment_number} - ₹ {item.total_amount}
                </option>
              ))}
            </select>
          </div>

          <div className="field-group">
            <label>Payment Amount</label>

            <input
              type="number"
              placeholder="Enter Payment Amount"
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label>Payment Mode</label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
            >
              <option value="CASH">Cash</option>

              <option value="UPI">UPI</option>

              <option value="CARD">Card</option>

              <option value="BANK">Bank</option>
            </select>
          </div>
        </div>

        <div className="payment-actions">
          <button className="primary-btn" onClick={makePayment}>
            Collect Payment
          </button>
        </div>
      </div>

      {/* ============================== */}
      {/* PAYMENTS TABLE */}
      {/* ============================== */}

      <div className="payment-table-card">
        <table className="payment-table">
          <thead>
            <tr>
              <th>#</th>

              <th>Receipt No</th>

              <th>Assessment</th>

              <th>Amount</th>

              <th>Mode</th>

              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {payments.map((item, index) => (
              <tr key={item.id}>
                <td>{index + 1}</td>

                <td>{item.payment_number}</td>

                <td>{item.assessment_number}</td>

                <td>₹ {item.payment_amount}</td>

                <td>{item.payment_mode}</td>

                <td>{item.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentsPage;
