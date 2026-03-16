const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");

const taxController = require("../controllers/tax.controller");

router.post("/estimate", auth, taxController.estimateTax);

router.post("/save", auth, taxController.saveTax);

router.get("/calendar", auth, taxController.getTaxCalendar);

module.exports = router;