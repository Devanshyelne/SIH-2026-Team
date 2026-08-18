require("dotenv").config();

const app = require("./app");
const connectMongoDB = require("./config/db_mongo");

const PORT = Number(process.env.PORT) || 5000;
const HOST = "0.0.0.0";

function validateEnvironment() {
    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is required");
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is required");
    }
}


async function startServer() {
    try {
        validateEnvironment();

        // Connect MongoDB before starting Express
        await connectMongoDB();

        // Start Express server
        const server = app.listen(PORT, HOST, () => {
            console.log(
                `SETU Backend running on http://${HOST}:${PORT}`
            );
        });

        server.on("error", (error) => {
            console.error(
                "SETU Backend server error:",
                error
            );

            process.exit(1);
        });

        server.on("close", () => {
            console.log("SETU Backend server closed");
        });

        process.on("SIGTERM", () => {
            console.log("SIGTERM received");

            server.close(() => {
                console.log("SETU Backend stopped");
                process.exit(0);
            });
        });

        process.on("SIGINT", () => {
            console.log("SIGINT received");

            server.close(() => {
                console.log("SETU Backend stopped");
                process.exit(0);
            });
        });

    } catch (error) {

        console.error(
            "Failed to start SETU Backend:",
            error.message
        );

        process.exit(1);
    }
}


startServer();