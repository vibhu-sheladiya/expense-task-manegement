const express=require('express');

const csvtojsonV2=require("csvtojson");
const csv = require('csvtojson');
const path = require('path');

// const { singleFileUpload } = require("../../helpers/upload");

const router=express.Router();



// const express = require('express');
const expenseController = require('../../controllers/expense.controller');
const { authMiddleware } = require('../../middlewares/auth');
const { checkRole } = require('../../middlewares/role');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

// POST /api/expenses (create single expense)
router.post('/create-upload',
    //  authMiddleware,
    expenseController.createExpense);

// POST /api/expenses/upload (bulk upload CSV)
router.post('/upload', 
    // authMiddleware,
     upload.single('file'), expenseController.uploadExpensesCSV);

// GET /api/expenses (read expenses with filters)
router.get('/',
    //  authMiddleware, 
     expenseController.getExpenses);

// PATCH /api/expenses/:id (update expense)
router.patch('/:id',
    //  authMiddleware, 
     expenseController.updateExpense);

// DELETE /api/expenses (bulk delete expenses)
router.delete('/', 
    // authMiddleware, 
    expenseController.deleteExpenses);

// GET /api/expenses/stats (get expense statistics)
router.get('/stats',
    //  authMiddleware, 
     expenseController.getExpenseStatistics);

// module.exports = router;
// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         cb(null,"./uploads");
//     },filename:(req,res,cb)=>{
//         cb(null,file.originalname)
//     },
// })

// const upload= multer({
//     storage
// })


// router.post('/uploadAll', upload.single("csvFile"), async (req, res) => {
//     try {
//         const csvFilePath = path.join(__dirname, 'uploads', req.file.originalname);  // Construct file path

//         // Convert CSV to JSON array
//         const jsonArray = await csv().fromFile(csvFilePath);

//         // Do something with jsonArray (like saving to DB, etc.)
//         console.log(jsonArray);

//         res.status(200).json({
//             message: 'CSV file uploaded and processed successfully!',
//             data: jsonArray
//         });
//     } catch (error) {
//         console.error('Error processing CSV:', error);
//         res.status(500).json({
//             message: 'Error uploading or processing CSV file',
//             error: error.message
//         });
//     }
// });



module.exports=router;
