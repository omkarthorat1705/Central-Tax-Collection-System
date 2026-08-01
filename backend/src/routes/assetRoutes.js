const express = require("express");

const router = express.Router();

const {
  getAssets,
  getAssetById,
  registerAsset,
  updateAsset,
  deleteAsset,
  getAssetTypes,
} = require("../controllers/assetController");

router.get("/getAssets", getAssets);

router.get("/getAssetTypes", getAssetTypes);

router.get("/:id", getAssetById);

router.post("/registerAsset", registerAsset);

router.put("/:id", updateAsset);

router.delete("/:id", deleteAsset);

module.exports = router;
