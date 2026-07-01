const validatePayment = (req, res, next) => {
  const { assessment_id, payment_amount, payment_mode } = req.body;

  if (!assessment_id) {
    return res.status(400).json({
      success: false,
      error: "assessment_id is required",
    });
  }

  if (!payment_amount) {
    return res.status(400).json({
      success: false,
      error: "payment_amount is required",
    });
  }

  if (Number(payment_amount) <= 0) {
    return res.status(400).json({
      success: false,
      error: "Invalid payment amount",
    });
  }

  if (!payment_mode) {
    return res.status(400).json({
      success: false,
      error: "payment_mode is required",
    });
  }

  next();
};

module.exports = {
  validatePayment,
};
