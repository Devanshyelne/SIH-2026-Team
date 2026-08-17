const express = require("express");
const cors = require("cors");

const stationRoutes = require("./routes/stationRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const journeyRoutes = require("./routes/journeyRoutes");
const crowdRoutes = require("./routes/crowdRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "SETU Backend is running"
    });
});

app.use("/api/stations", stationRoutes);
app.use("/api/facilities", facilityRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/crowd", crowdRoutes);
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;