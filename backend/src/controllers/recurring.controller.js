const recurringService = require("../services/recurring.service");
const { successResponse } = require("../utils/response");

exports.create = async (req, res, next) => {
  try {
    const item = await recurringService.create(req.user.id, req.body);
    successResponse(res, item, "Recurring transaction created", 201);
  } catch (error) {
    next(error);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const items = await recurringService.getAll(req.user.id);
    successResponse(res, items, "Recurring transactions fetched");
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const item = await recurringService.update(req.user.id, req.params.id, req.body);
    successResponse(res, item, "Recurring transaction updated");
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await recurringService.delete(req.user.id, req.params.id);
    successResponse(res, null, "Recurring transaction deleted");
  } catch (error) {
    next(error);
  }
};

exports.processDue = async (req, res, next) => {
  try {
    const created = await recurringService.processDue(req.user.id);
    successResponse(res, created, `${created.length} recurring transactions processed`);
  } catch (error) {
    next(error);
  }
};
