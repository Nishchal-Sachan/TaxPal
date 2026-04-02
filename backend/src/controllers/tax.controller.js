const taxService = require("../services/tax.service");
const { successResponse } = require("../utils/response");

exports.estimateTax = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const result = await taxService.estimateTax(userId, req.body);
    successResponse(res, result, "Tax estimated successfully");
  } catch (error) {
    next(error);
  }
};

exports.saveTax = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { quarter, amount } = req.body;
    const result = await taxService.saveTaxEstimate(userId, quarter, amount);
    successResponse(res, result, "Tax estimate saved successfully", 201);
  } catch (error) {
    next(error);
  }
};

exports.getTaxCalendar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const calendar = await taxService.getTaxCalendar(userId);
    successResponse(res, calendar, "Tax calendar fetched successfully");
  } catch (error) {
    next(error);
  }
};

exports.toggleTaxStatus = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const result = await taxService.toggleTaxStatus(userId, id);
    successResponse(res, result, "Tax status updated");
  } catch (error) {
    next(error);
  }
};
