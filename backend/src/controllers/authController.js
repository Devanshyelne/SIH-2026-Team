const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function generateToken(user) {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("JWT_SECRET is not configured");
    }

    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        },
        secret,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d"
        }
    );
}

function sanitizeUser(user) {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email
    };
}

// ==========================================
// REGISTER
// POST /api/auth/register
// ==========================================

async function register(req, res) {
    try {
        const { username, email, password } = req.body || {};

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Username, email and password are required"
            });
        }

        const cleanUsername = String(username).trim();
        const cleanEmail = String(email).trim().toLowerCase();

        if (cleanUsername.length < 3) {
            return res.status(400).json({
                success: false,
                message: "Username must be at least 3 characters"
            });
        }

        if (cleanUsername.length > 30) {
            return res.status(400).json({
                success: false,
                message: "Username must not exceed 30 characters"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const existingEmail = await User.findOne({
            email: cleanEmail
        });

        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const existingUsername = await User.findOne({
            username: cleanUsername
        });

        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username is already taken"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password: hashedPassword
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: sanitizeUser(user)
        });

    } catch (error) {
        console.error("Register error:", error);

        if (error.code === 11000) {
            const duplicateField = Object.keys(error.keyPattern || {})[0];

            return res.status(409).json({
                success: false,
                message:
                    duplicateField === "email"
                        ? "Email is already registered"
                        : "Username is already taken"
            });
        }

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
        const { identifier, password } = req.body || {};

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Username/email and password are required"
            });
        }

        const cleanIdentifier = String(identifier).trim();

        const user = await User.findOne({
            $or: [
                {
                    email: cleanIdentifier.toLowerCase()
                },
                {
                    username: cleanIdentifier
                }
            ]
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username/email or password"
            });
        }

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
            user: sanitizeUser(user)
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
// CURRENT USER
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
            user: sanitizeUser(user)
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