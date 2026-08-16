const express = require("express");

const router = express.Router();

const {
    getJourneys,
    findRoute
} = require("../controllers/journeyController");


// Get all connections
router.get("/", getJourneys);


// Find shortest route
router.get("/route", findRoute);


module.exports = router;