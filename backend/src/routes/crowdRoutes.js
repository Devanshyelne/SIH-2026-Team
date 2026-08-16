const express = require("express");

const router = express.Router();

const {
    getCrowdData
} = require("../controllers/crowdController");

router.get("/", getCrowdData);

module.exports = router;