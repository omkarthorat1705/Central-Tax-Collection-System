const express = require("express");

const router = express.Router();

const {
  getParameters,
  addParameter,
  deleteParameter,
  getAssetParameters,
} = require("../controllers/parameterController");

// =====================================
// GET ALL PARAMETERS
// =====================================

router.get("/getParameters", getParameters);
router.post("/getAssetParameters", getAssetParameters);

// =====================================
// GET PARAMETERS BY TAX TYPE
// =====================================

router.get("/getParameters/:taxTypeId", getParameters);

// =====================================
// ADD PARAMETER
// =====================================

router.post("/addParameter", addParameter);

// =====================================
// DELETE PARAMETER
// =====================================

router.delete("/deleteParameter/:id", deleteParameter);

module.exports = router;
