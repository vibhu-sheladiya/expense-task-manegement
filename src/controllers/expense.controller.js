const { model } = require('mongoose');
const Expense = require('../models/expense.model');
const parseCSV = require('../utils/csvParser');
const validateExpense = require('../utils/validateExpense');

// Add Expense
const addExpense = async (req, res) => {
    try {
        const { title, amount, date, category, description, paymentMethod } = req.body;
        const user = req.user.id;

        const errors = validateExpense({ title, amount, date, category, description, paymentMethod });
        if (errors.length) return res.status(400).json({ errors });

        const newExpense = new Expense({ title, amount, date, category, description, paymentMethod, user });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Bulk Upload Expenses
const bulkUpload = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const userId = req.user.id;

        const expenses = await parseCSV(req.file);

        const expensesWithUser = expenses.map(expense => ({
            ...expense,
            user: userId,
            amount: parseFloat(expense.amount),
            date: new Date(expense.date)
        }));

        const validExpenses = expensesWithUser.filter(expense => {
            const errors = validateExpense(expense);
            return errors.length === 0;
        });

        if (validExpenses.length > 0) {
            await Expense.insertMany(validExpenses);
            res.status(201).json({ message: 'Expenses added successfully' });
        } else {
            res.status(400).json({ message: 'No valid expenses found in the file' });
        }
    } catch (err) {
        console.error('Error during bulk upload:', err);
        res.status(500).json({ error: 'An error occurred during bulk upload' });
    }
};




// Get Expenses with Filtering and Pagination
const getExpenses = async (req, res) => {
    const { page = 1, limit = 10, category, startDate, endDate, paymentMethod } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    if (paymentMethod) filter.paymentMethod = paymentMethod;

    try {
        const expenses = await Expense.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ date: -1 });

        const count = await Expense.countDocuments(filter);
        res.json({ expenses, totalPages: Math.ceil(count / limit), currentPage: page });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Expense
const updateExpense = async (req, res) => {
    try {
        const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedExpense);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Delete Expense
const deleteExpense = async (req, res) => {
    try {
        await Expense.deleteMany({ _id: { $in: req.query.ids.split(',') } });
        res.status(200).json({ message: 'Expenses deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
  deleteExpense,updateExpense,getExpenses,bulkUpload,addExpense
}