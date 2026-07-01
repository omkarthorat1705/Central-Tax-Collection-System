const express = require("express");

const router = express.Router();

const {
  getRules,
  addRule,
  deleteRule,
} = require("../controllers/ruleController");

router.get("/getRules", getRules);

router.get("/getRules/:taxTypeId", getRules);

router.post("/addRule", addRule);

router.delete("/deleteRule/:id", deleteRule);

module.exports = router;
