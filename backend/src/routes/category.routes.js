const express = require("express");
const router = express.Router();
const controller = require("../controllers/category.controller");
const auth = require("../middlewares/auth.middleware");

router.post("/", auth, controller.createCategory);
router.get("/", auth, controller.getCategories);
router.put("/:id", auth, controller.updateCategory);
router.delete("/:id", auth, controller.deleteCategory);

module.exports = router;