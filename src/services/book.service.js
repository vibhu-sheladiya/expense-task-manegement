const { Book } = require("../models");
/**
 * Create book
 * @param {object} reqBody
 * @returns {Promise<User>}
 */
const createBookServices = async (reqBody) => {
  return Book.create(reqBody);
};

/**
 * Get book list
//  */

// const getAllBook = async () => {
//   return await Book.find().populate('userid'); // Assuming Recipe is a model representing your recipes in the database
// };

// const getRecipeById = async (recipeId) => {
//   return await Book.findById(recipeId);
// };

// const updateRecipe = async (recipeId, updateBody) => {
//   return Book.findByIdAndUpdate(recipeId, { $set: updateBody });
// };

// const deleteRecipe = async (recipeId) => {
//   return Book.findByIdAndDelete(recipeId);
// };

module.exports={
  createBookServices
};
