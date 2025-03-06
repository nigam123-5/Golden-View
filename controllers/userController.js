const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); 
const jwt = require("jsonwebtoken");


// User signup route
const signup = async (req, res) => {
    try {
        const { name, email, password, phoneNumber, age } = req.body;

        if (!name || !email || !password || !phoneNumber || !age) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashedPassword,
            phoneNumber,
            age,
        });

        const token = jwt.sign({ id: user._id, email: user.email }, "GoldenHotel", {
            expiresIn: "10h",
        });

        const savedUser = await user.save();
        res.status(201).json({
            success: true,
            token,
            user: { ...savedUser },
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            message: "Error creating user",
            error: error.message || error,
        });
    }
};

// User login route
const login =  async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, "GoldenHotel", {
            expiresIn: "1h",
        });

        res.status(200).json({
            success: true,
            token,
            user: { id: user._id, email: user.email, name: user.name },
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            message: "Error logging in user",
            error: error.message || error,
        });
    }
};

// Get all users route
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update user route
const updateUser = async (req, res) => {
try {
    const { id } = req.params;
    const { name, email, phoneNumber, age } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email, phoneNumber, age },
        { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json(updatedUser);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
}
};
// Get user by ID route
const getUserById = async (req, res) => {
try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
}
};



module.exports = { getAllUsers, signup, login, getUserById, updateUser};
