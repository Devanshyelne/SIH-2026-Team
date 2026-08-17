const express = require("express");

const {
    getCrowdData,
    getPredictedCrowd,
    getLowCrowdRoute
} = require("../controllers/crowdController");

const router = express.Router();

// Database crowd data
router.get("/", getCrowdData);

// AI crowd prediction
router.get("/predict", getPredictedCrowd);

// AI low-crowd route
router.get("/routes", getLowCrowdRoute);

module.exports = router;