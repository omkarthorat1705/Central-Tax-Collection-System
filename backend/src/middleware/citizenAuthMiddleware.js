const jwt = require("jsonwebtoken");

const JWT_SECRET = "ctcs_super_secret_key";

const citizenAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        error: "Token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.userType !== "citizen") {
      return res.status(401).json({
        success: false,
        error: "Invalid citizen token",
      });
    }

    req.citizen = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};

module.exports = citizenAuthMiddleware;
