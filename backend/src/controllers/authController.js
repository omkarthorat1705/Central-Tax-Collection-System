const authService = require("../services/authService");

const login = async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body);

    const { authorityCode, username, password } = req.body;

    const result = await authService.login(authorityCode, username, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    res.status(401).json({
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  login,
};
