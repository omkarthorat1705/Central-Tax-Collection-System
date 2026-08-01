const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboardController");

router.get("/getRevenueSummary", dashboardController.getRevenueSummary);
router.get("/getWardWiseCollection", dashboardController.getWardWiseCollection);
router.get("/getTaxWiseCollection", dashboardController.getTaxWiseCollection);

module.exports = router;
