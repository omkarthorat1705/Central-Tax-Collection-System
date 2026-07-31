const express = require("express");

const router = express.Router();

const {
  getAssets,
  getAssetById,
  registerAsset,
  updateAsset,
  getAssetTypes,
} = require("../controllers/assetController");

router.get("/getAssets", getAssets);
router.get("/:id", getAssetById);
router.post("/registerAsset", registerAsset);
router.put("/:id", updateAsset);
router.get("/getAssetTypes", getAssetTypes);

module.exports = router;
