/* ------------------------------- DEFINE AREA ------------------------------ */
const bcrypt = require("bcrypt");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const { userService } = require("../services");
const { User } = require("../models");

/* -------------------------- REGISTER/CREATE User -------------------------- */
const register = async (req, res) => {
  try {
    const {
      email,
      password,
      username,
      role
    } = req.body;

    // Check if required fields are missing
    if (
      !email ||
      !password ||
      !username || !role
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing Required Fields.",
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email Format.",
      });
    }

    // // Validate password strength
    // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
    // if (!passwordRegex.test(password)) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Password Must Be At Least 8 Characters Long and Contain At Least One Uppercase Letter, One Lowercase Letter, And One Number.",
    //   });
    // }

    // // Check if passwords match
    // if (password !== confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "New Password And Confirm Password Do Not Match.",
    //   });
    // }

    // Check if user with the same email already exists
    const existingUser = await userService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User With This Email Already Exists.",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 8);

    // JWT token creation
    let option = {
      email,
      exp: moment().add(1, "days").unix(),
    };
    const token = await jwt.sign(option, process.env.JWT_SECRET_KEY);

    // Generate refresh token
    const refreshToken = await jwt.sign(
      option,
      process.env.JWT_REFRESH_SECRET_KEY
    );

    // Prepare data for creating user
    const filter = {
      email,
      username,     
      password: hashPassword,
      token,role,
      refreshToken, // Include refresh token in the data  
    };

    // Create user
    const data = await userService.createUser(filter);

    // Respond with success message
    res.status(200).json({
      success: true,
      message: "User Registered Successfully",
      status: 200,
      data: data,
      userId: data._id,
      refreshToken: refreshToken, // Include refresh token in the response
    });
  } catch (err) {
    // Handle errors
    res.status(500).json({ error: err.message });
  }
};

//   /* -------------------------- LOGIN  -------------------------- */
const login = async (req, res) => {
  try {
    const { email, password } = req.body; // Assuming "identifier" can be either email or name
    const user = await User.findOne({ email });
    if (!user) throw Error("user Not Found");

    const successPassword = await bcrypt.compare(password, user.password);
    if (!successPassword) throw Error("Incorrect Password");

    const payload = {
      _id: user._id,
      email: user.email,
    };

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "15m",
    });

    user.token = token;
    // user.fcm_token = fcm_token;
    const refreshToken = await jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET_KEY
    );
    const output = await user.save();
    const baseUrl =
      req.protocol +
      "://" +
      req.get("host") +
      process.env.BASE_URL_PROFILE_PATH;

    res.status(200).json({
      data: output,
      token: token,
      refreshToken: refreshToken,
      baseUrl: baseUrl,
      message: "Login Successful",
      userId: output._id,
      status: 200,
      success: true,
    });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};



module.exports = {
  register,login
}
