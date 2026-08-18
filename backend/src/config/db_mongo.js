const mongoose = require("mongoose");

async function connectMongoDB() {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoUri);

        console.log("MongoDB connected successfully");

        mongoose.connection.on("error", (error) => {
            console.error("MongoDB runtime error:", error);
        });

        mongoose.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected");
        });

    } catch (error) {
        console.error(
            "MongoDB connection failed:",
            error.message
        );

        throw error;
    }
}

module.exports = connectMongoDB;