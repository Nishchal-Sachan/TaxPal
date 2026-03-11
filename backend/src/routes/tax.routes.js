const express = require("express");
const router = express.Router();

const taxController = require("../controllers/tax.controller");
const auth = require("../middlewares/auth.middleware");

router.post(
  "/estimate",
  auth,
  taxController.estimateTax
);

module.exports = router;