const fs = require("fs");

module.exports = deleteFile = (file) => {
  const basePath = __dirname + "/../public/" + file;
  // console.log(fs.existsSync(basePath));
  try {
    if (fs.existsSync(basePath)) {
      fs.unlinkSync(basePath);
      // res.status(200).json({
      //   status: 200,
      //   success: true,
      //   message: `${basePath} deleted successfully.`,
      // });
      return { success: true, message: `${basePath} deleted successfully.` };
    } else {
      // response.status(404).json({
      //   status: 404,
      //   success: false,
      //   message: `${basePath} does not exist.`,
      // });
      return { success: false, message: `${basePath} does not exist.` };
    }
  } catch (error) {
    // res.status(400).json({
    //   status: 400,
    //   success: false,
    //   message: `Error deleting ${basePath}:`,
    // });
    return { success: false, message: `Error deleting ${basePath}: ${error.message}` };
  }
};