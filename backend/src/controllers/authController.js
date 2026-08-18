const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }

    return jwt.sign(
        {
            id: user._id,
            username: user.username,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
}


// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

async function register(req, res) {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required"
            });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        // Check email
        const existingEmail = await User.findOne({
            email: cleanEmail
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Check username
        const existingUsername = await User.findOne({
            username: cleanUsername
        });

        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        });

        // Generate JWT
        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",

            token,

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Register error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create account"
        });
    }
}


// ==========================================
// LOGIN
// POST /api/auth/login
// ==========================================

async function login(req, res) {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Username/email and password are required"
            });
        }

        const cleanIdentifier = identifier.trim().toLowerCase();

        // Search using email OR username
        const user = await User.findOne({
            $or: [
                {
                    email: cleanIdentifier
                },
                {
                    username: identifier.trim()
                }
            ]
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password"
            });
        }

        // Compare password
        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password"
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to login"
        });
    }
}


// ==========================================
// GET CURRENT USER
// GET /api/auth/me
// ==========================================

async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,

            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Get user error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to get user"
        });
    }
}


module.exports = {
    register,
    login,
    getMe
};