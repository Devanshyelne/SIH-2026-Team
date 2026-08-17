require("dotenv").config();

const app = require("./app");
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`SETU Backend running on port ${PORT}`);
});

function shutdown(signal) {
    console.log(`${signal} received; shutting down gracefully`);
    server.close(() => process.exit(0));
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
