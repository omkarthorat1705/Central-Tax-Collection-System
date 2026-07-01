const express = require("express");

const router = express.Router();

const lifecycleService = require("../services/assessmentLifecycleService");

router.post(
  "/assessment/freeze/:id",

  async (req, res) => {
    try {
      await lifecycleService.freezeAssessment(req.params.id);

      res.json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },
);

module.exports = router;
