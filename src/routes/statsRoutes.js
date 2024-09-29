const express = require('express');
const { getMonthlyExpenses, getCategoryExpenses } = require('../controllers/statsController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/monthly', verifyToken, getMonthlyExpenses);
router.get('/category', verifyToken, getCategoryExpenses);

module.exports = router;
