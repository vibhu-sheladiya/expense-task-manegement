const express = require('express');
const multer = require('multer');
const { addExpense, bulkUpload, getExpenses, updateExpense, deleteExpense } = require('../controllers/expenseController');
const { verifyToken } = require('../middleware/authMiddleware');
const { checkRole } = require('../middleware/roleMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/add', verifyToken, addExpense);
router.post('/bulk-upload',
    //  verifyToken,
     upload.single('file'), bulkUpload);
router.get('/', verifyToken, getExpenses);
router.patch('/:id', verifyToken, updateExpense);
router.delete('/', verifyToken, deleteExpense);

module.exports = router;
