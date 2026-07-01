const express = require("express");

const router = express.Router();

const paymentController = require("../controllers/paymentController");
const { validatePayment } = require("../validators/paymentValidator");

router.post("/makePayment", validatePayment, paymentController.makePayment);

module.exports = router;
