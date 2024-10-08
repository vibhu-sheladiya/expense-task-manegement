const User = require('../models/user.model');
const generateToken = require('../config/jwt');

// Register User
const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).json({ token: generateToken(user) });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Login User
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && await user.matchPassword(password)) {
            res.json({ token: generateToken(user) });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



module.exports = {
  register,login
}
