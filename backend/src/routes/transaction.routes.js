const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transaction.controller");
const protect = require("../middlewares/auth.middleware");

router.post("/", protect, transactionController.createTransaction);
router.post("/import", protect, transactionController.importTransactions);
router.get("/", protect, transactionController.getTransactions);
router.put("/:id", protect, transactionController.updateTransaction);
router.delete("/:id", protect, transactionController.deleteTransaction);

module.exports = router;
