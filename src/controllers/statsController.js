const Expense = require('../models/Expense');

// Get Monthly Expenses
exports.getMonthlyExpenses = async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const userId = new ObjectId(req.user.id);

        const { month, year } = req.query;

        let matchCondition = { user: userId };

        if (month && year) {
            matchCondition = {
                ...matchCondition,
                $expr: {
                    $and: [
                        { $eq: [{ $month: "$date" }, parseInt(month)] },
                        { $eq: [{ $year: "$date" }, parseInt(year)] }
                    ]
                }
            };
        }

        const result = await Expense.aggregate([
            { $match: matchCondition },
            {
                $group: {
                    _id: { month: { $month: "$date" }, year: { $year: "$date" } },
                    totalAmount: { $sum: "$amount" },
                    expenses: {
                        $push: {
                            date: "$date",
                            amount: "$amount",
                            category: "$category"
                        }
                    }
                }
            },
            { $sort: { "_id.year": -1, "_id.month": -1 } }
        ]);
        console.log(JSON.stringify(result, null, 2));
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get Expenses by Category 
exports.getCategoryExpenses = async (req, res) => {
    try {
        const { ObjectId } = require('mongodb');
        const userId = new ObjectId(req.user.id);
        const { category } = req.query; 

        let matchCriteria = { user: userId };

        if (category) {
            matchCriteria.category = category;
        }
        console.log(category);

        const result = await Expense.aggregate([
            { $match: matchCriteria }, 
            {
                $group: {
                    _id: "$category",
                    totalAmount: { $sum: "$amount" }
                }
            },
            { $sort: { totalAmount: -1 } } 
        ]);

        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

