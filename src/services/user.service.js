const { User } = require("../models");
/**
 * Create user
 * @param {object} reqBody
 * @returns {Promise<User>}
 */
const createUser = async (reqBody) => {
  return User.create(reqBody);
};

/**
 * Get user list
  * @param {object} filter
  * @param {object} options
  * @returns {Promise<User>}
 */
const getUserList = async (filter, options) => {
const skip = (Number(options.page || 1) - 1) * Number(options.limit || 10);
return User.find(filter).skip(skip).limit(options.limit).select("-password");
  };

  const findUserByEmail = async (email) => {
    return await User.findOne({email});
  };


  
module.exports={
    createUser,
    getUserList,
    findUserByEmail
};
