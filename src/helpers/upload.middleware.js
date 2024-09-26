const multer = require('multer');

// const upload = multer({
//     limits: { fileSize: parseInt(process.env.MAX_CSV_SIZE) || 1048576 }, // 1MB default
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(csv)$/)) {
//             return cb(new Error('Please upload a CSV file.'));
//         }
//         cb(null, true);
//     }
// });


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
module.exports = upload;