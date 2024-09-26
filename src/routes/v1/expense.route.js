const express=require('express');
const {bookController}=require('../../controllers');
const csvtojsonV2=require("csvtojson");
const csv = require('csvtojson');
const path = require('path');

// const { singleFileUpload } = require("../../helpers/upload");

const router=express.Router();

// create recipe 
// router.post("/create-book",
//     singleFileUpload("/images", "book_image"),
// bookController.createBook
// );

// Bulk Upload Expenses
// exports.bulkUpload = async (req, res) => {
//   try {

//       if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

//       const expenses = await parseCSV(req.file);

//       // Validate and filter expenses
//       const validExpenses = expenses.filter(expense => {
//           const errors = validateExpense(expense);
//           return errors.length === 0;
//       });

//       if (validExpenses.length > 0) {
//           await Expense.insertMany(validExpenses);
//           res.status(201).json({ message: 'Expenses added successfully' });
//       } else {
//           res.status(400).json({ message: 'No valid expenses found in the file' });
//       }
//   } catch (err) {
//       console.error('Error during bulk upload:', err);
//       res.status(500).json({ error: 'An error occurred during bulk upload' });
//   }
// };


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"./uploads");
    },filename:(req,res,cb)=>{
        cb(null,file.originalname)
    },
})

const upload= multer({
    storage
})


router.post('/uploadAll', upload.single("csvFile"), async (req, res) => {
    try {
        const csvFilePath = path.join(__dirname, 'uploads', req.file.originalname);  // Construct file path

        // Convert CSV to JSON array
        const jsonArray = await csv().fromFile(csvFilePath);

        // Do something with jsonArray (like saving to DB, etc.)
        console.log(jsonArray);

        res.status(200).json({
            message: 'CSV file uploaded and processed successfully!',
            data: jsonArray
        });
    } catch (error) {
        console.error('Error processing CSV:', error);
        res.status(500).json({
            message: 'Error uploading or processing CSV file',
            error: error.message
        });
    }
});

// router.post('/bulk-upload', verifyToken, upload.single('file'), bulkUpload);
// // // list book 
// router.get("/list-book",
//     bookController.getBookList
//     );

// //     // list book by id
//     router.get("/list-book-id",
//         bookController.getBookById
//         );

//         // // list book 
// router.get("/list-borrow-return-book",
//   bookController.getBookBorrowReturn
//   );

    
// //         // update book by id
//         router.put("/update-book-id",
//     singleFileUpload("/images", "book_image"),
//             bookController.updateBookProfile
//             );

//             /* -------------------------- DELTE BOOK ----------- */
// router.delete(
//     "/delete-book/:bookId",
//     // accessToken(),
//     bookController.deleteBook
//   );
  

module.exports=router;
