const express = require("express");

const router = express.Router();

const { getAuthorities } = require("../controllers/tenantController");

router.get("/getAuthorities", getAuthorities);

module.exports = router;
