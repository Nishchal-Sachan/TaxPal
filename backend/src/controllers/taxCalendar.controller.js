const taxService = require("../services/taxCalendar.service");
exports.saveTax = async (req, res) => {
  try {
    const { quarter, amount } = req.body;

    const result = await taxService.saveTaxEstimate({
      quarter,
      amount
    });
    res.status(201).json({
      message: "Tax estimate saved",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Error saving tax estimate",
      error: error.message
    });
  }
};
exports.getTaxCalendar = async (req, res) => {
  try {
    const calendar = await taxService.getTaxCalendar();
    res.status(200).json(calendar);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tax calendar",
      error: error.message
    });
  }
};
