const express = require("express");

const router = express.Router();

const assessmentController = require("../controllers/assessmentController");
const {
  validateGenerateAssessment,
} = require("../validators/assessmentValidator");

router.post(
  "/generateAssessment",
  validateGenerateAssessment,
  assessmentController.generateAssessment,
);

module.exports = router;
