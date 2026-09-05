const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const recurringController = require("../controllers/recurring.controller");

router.post("/", auth, recurringController.create);
router.get("/", auth, recurringController.getAll);
router.put("/:id", auth, recurringController.update);
router.delete("/:id", auth, recurringController.delete);
router.post("/process", auth, recurringController.processDue);

module.exports = router;
