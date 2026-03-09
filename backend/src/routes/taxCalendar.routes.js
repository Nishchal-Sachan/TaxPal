const express = require("express");
const router = express.Router();
const taxController = require("../controllers/taxCalendar.controller");
router.post("/save", taxController.saveTax);
router.get("/calendar", taxController.getTaxCalendar);
module.exports = router;
