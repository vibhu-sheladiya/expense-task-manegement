const Expense = require('../models');
const ErrorResponse = require('../utils/errorResponse');
const csvParser = require('csv-parser');
const fs = require('fs');

// Create single expense
exports.createExpense = async (req, res) => {
  try {
    const { amount, category, date, paymentMethod } = req.body;
    const expense = new Expense({
      amount, category, date, paymentMethod, userId: req.user.id,
    });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Bulk CSV upload
exports.uploadExpensesCSV = (req, res) => {
  const expenses = [];
  fs.createReadStream(req.file.path).pipe(csvParser()).on('data', (row) => {
    expenses.push({ ...row, userId: req.user.id });
  })
    .on('end', async () => {
      try {
        await Expense.insertMany(expenses);
        res.status(201).json({ message: 'Expenses uploaded successfully', expenses });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    });
};

// Get expenses with filtering, sorting, and pagination
exports.getExpenses = async (req, res, next) => {
  try {
    const { category, paymentMethod, dateFrom, dateTo, sort, page = 1, limit = 10 } = req.query;

    // Create a filter object
    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (paymentMethod) {
      filter.paymentMethod = paymentMethod;
    }

    if (dateFrom || dateTo) {
      filter.date = {};
      if (dateFrom) {
        filter.date.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.date.$lte = new Date(dateTo);
      }
    }

    // Pagination logic
    const skip = (page - 1) * limit;

    // Sorting logic (default: createdAt)
    const sortBy = sort ? sort.split(',').join(' ') : 'createdAt';

    // Fetch expenses with filters, sorting, and pagination
    const expenses = await Expense.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(parseInt(limit));

    // Total count of filtered expenses (for pagination)
    const totalExpenses = await Expense.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: expenses.length,
      total: totalExpenses,
      page: parseInt(page),
      pages: Math.ceil(totalExpenses / limit),
      data: expenses,
    });
  } catch (err) {
    next(err);
  }
};

// Update expense
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedExpense = await Expense.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });

    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete expenses
exports.deleteExpenses = async (req, res) => {
  try {
    const { ids } = req.body; // Array of expense IDs
    await Expense.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ message: 'Expenses deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Expense statistics using MongoDB aggregation

exports.getExpenseStatistics = async (req, res) => {
  try {
    const { ObjectId } = require('mongodb');
    const userId = new ObjectId(req.user.id);

    // Get query parameters for optional filtering
    const { month } = req.query;

    // Build the match query based on userId and optionally filter by month
    let matchQuery = { userId: userId };

    // If a specific month is provided, filter for that month
    if (month) {
      matchQuery = {
        ...matchQuery,
        $expr: {
          $eq: [{ $month: "$date" }, parseInt(month)]
        }
      };
    }

    const stats = await Expense.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: { month: { $month: "$date" } }, // Group by month only
          totalAmount: { $sum: "$amount" },    // Sum total expenses for each month
        }
      },
      { $sort: { "_id.month": 1 } } // Sort by month in ascending order
    ]);

    console.log(stats);

    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};