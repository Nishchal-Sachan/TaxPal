const taxService = require("../services/tax.service");
const { successResponse } = require("../utils/response");

exports.estimateTax = async (req, res, next) => {
  try {

    const userId = req.user.id;

    const result = await taxService.estimateTax(
      userId,
      req.body
    );

    successResponse(
      res,
      result,
      "Tax estimated successfully"
    );

  } catch (error) {
    next(error);
  }
};