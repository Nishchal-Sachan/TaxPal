const { successResponse } = require("../utils/response");
const categoryService = require("../services/category.service");

exports.createCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const category = await categoryService.createCategory(
      userId,
      req.body
    );

    successResponse(res, category, "Category created", 201);
  } catch (err) {
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const categories = await categoryService.getCategories(userId);

    successResponse(res, categories, "Categories fetched");
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const updated = await categoryService.updateCategory(
      userId,
      req.params.id,
      req.body
    );

    successResponse(res, updated, "Category updated");
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await categoryService.deleteCategory(userId, req.params.id);

    successResponse(res, null, "Category deleted");
  } catch (err) {
    next(err);
  }
};