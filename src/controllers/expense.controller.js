const Expense = require('../models');

// Add Expenses
exports.addExpenses = async (req, res) => {
  try {
    const expenses = await Expense.create(req.body);
    res.status(201).json({
      status: 'success',
      data: expenses
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Read Expenses with filtering, sorting, and pagination
exports.getExpenses = async (req, res) => {
  try {
    const { category, dateRange, paymentMethod, sortBy, page, limit } = req.query;
    let filter = {};
    
    if (category) filter.category = category;
    if (paymentMethod) filter.paymentMethod = paymentMethod;
    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      filter.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const expenses = await Expense.find(filter)
      .sort(sortBy)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      results: expenses.length,
      data: expenses
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Update Expense (partial update)
exports.updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!expense) return res.status(404).json({ status: 'fail', message: 'No expense found' });
    
    res.status(200).json({ status: 'success', data: expense });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

// Delete Expense(s)
exports.deleteExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({ _id: { $in: req.body.expenseIds } });
    res.status(204).json({ status: 'success', message: 'Expenses deleted' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};
