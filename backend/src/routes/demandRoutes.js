const express = require("express");

const router = express.Router();

const controller = require("../controllers/demandController");

router.post("/generateDemand", controller.generateDemand);

router.get("/getDemands", controller.getDemands);

module.exports = router;
