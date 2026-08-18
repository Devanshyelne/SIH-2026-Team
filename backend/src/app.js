const express = require("express");
const cors = require("cors");

const stationRoutes = require("./routes/stationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const crowdRoutes = require("./routes/crowdRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const defaultOrigins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:8080"
];

const allowedOrigins = (process.env.CORS_ORIGIN || defaultOrigins.join(","))
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.disable("x-powered-by");

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
            return;
        }

        callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
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
app.use("/api/auth", authRoutes);

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

module.exports = app;