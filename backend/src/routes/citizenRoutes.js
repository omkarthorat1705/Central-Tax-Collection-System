const express = require("express");

const router = express.Router();

const {
  addCitizen,
  getCitizens,
  getCitizenById,
  updateCitizen,
  updateCitizenStatus,
} = require("../controllers/citizenController");

router.post("/addCitizen", addCitizen);

router.get("/getCitizens", getCitizens);

router.get("/citizens/:id", getCitizenById);

router.put("/citizens/:id", updateCitizen);

router.patch("/citizens/:id/status", updateCitizenStatus);

module.exports = router;
