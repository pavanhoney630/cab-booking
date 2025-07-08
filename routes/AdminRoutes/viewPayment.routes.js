const express = require("express");
const router = express.Router();
const {viewPaymentDetails } = require("../../controllers/AdminControllers/viewPayment.controller");

router.get("/:id", viewPaymentDetails);
module.exports = router;
