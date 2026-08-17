const express = require("express");
const cors = require("cors");

const stationRoutes = require("./routes/stationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const crowdRoutes = require("./routes/crowdRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.disable("x-powered-by");

app.use(cors({
    origin: allowedOrigins.includes("*") ? "*" : allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SETU Backend is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok"
    });
});

app.use("/api/stations", stationRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/chatbot", chatbotRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

module.exports = app;