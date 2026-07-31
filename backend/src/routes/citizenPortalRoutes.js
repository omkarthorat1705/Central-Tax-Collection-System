const express = require("express");
const router = express.Router();
const controller = require("../controllers/citizenPortalController");
const citizenAuthMiddleware = require("../middleware/citizenAuthMiddleware");

router.post("/citizen/login", controller.citizenLogin);
router.get("/citizen/portal", citizenAuthMiddleware, controller.getCitizenPortalSummary);

module.exports = router;
