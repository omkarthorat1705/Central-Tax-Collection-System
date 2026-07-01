const validateGenerateAssessment = (req, res, next) => {
  const { asset_id, financial_year } = req.body;

  if (!asset_id) {
    return res.status(400).json({
      success: false,
      error: "asset_id is required",
    });
  }

  if (!financial_year) {
    return res.status(400).json({
      success: false,
      error: "financial_year is required",
    });
  }

  next();
};

module.exports = {
  validateGenerateAssessment,
};
