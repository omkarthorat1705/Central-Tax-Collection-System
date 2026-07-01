const tenantRepository = require("../repositories/tenantRepository");

const getAuthorities = async (req, res) => {
  try {
    const data = await tenantRepository.getAuthorities();

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  getAuthorities,
};