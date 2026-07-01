const express = require("express");

const router = express.Router();

const {
  getAssets,
  registerAsset,
  getAssetTypes,
} = require("../controllers/assetController");

router.get("/getAssets", getAssets);

router.post("/registerAsset", registerAsset);

router.get("/getAssetTypes", getAssetTypes);

module.exports = router;
