const db = require("../config/db");

const CROWD_MODEL_URL = (
    process.env.CROWD_MODEL_URL ||
    "https://setu-crowd.onrender.com"
).replace(/\/$/, "");

// ==========================================
// DATABASE CROWD DATA
// ==========================================

const getCrowdData = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                id,
                record_date,
                record_time,
                platform,
                railway,
                service_type,
                crowd_count,
                crowd_density_percent,
                crowd_level,
                is_peak_hour,
                day_type,
                data_status
            FROM platform_crowd_data
            ORDER BY record_date DESC, record_time DESC
        `);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Crowd database API error:", error.message);

        res.status(500).json({
            message: "Failed to fetch crowd data"
        });
    }
};


// ==========================================
// AI CROWD PREDICTION
// GET /api/crowd/predict
// ==========================================

const getPredictedCrowd = async (req, res) => {
    try {
        const hour = req.query.hour || "18";
        const day = req.query.day || "1";
        const train = req.query.train || "5";

        const response = await fetch(
            `${CROWD_MODEL_URL}/api/crowd?hour=${encodeURIComponent(hour)}&day=${encodeURIComponent(day)}&train=${encodeURIComponent(train)}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Crowd model API error:", error.message);

        return res.status(502).json({
            message: "Crowd model service unavailable",
            error: error.message
        });
    }
};


// ==========================================
// LOW CROWD ROUTE
// GET /api/crowd/routes
// ==========================================

const getLowCrowdRoute = async (req, res) => {
    try {
        const hour = req.query.hour || "18";
        const day = req.query.day || "1";
        const train = req.query.train || "5";

        const response = await fetch(
            `${CROWD_MODEL_URL}/api/routes?hour=${encodeURIComponent(hour)}&day=${encodeURIComponent(day)}&train=${encodeURIComponent(train)}`
        );

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Crowd route API error:", error.message);

        return res.status(502).json({
            message: "Crowd route service unavailable",
            error: error.message
        });
    }
};


module.exports = {
    getCrowdData,
    getPredictedCrowd,
    getLowCrowdRoute
};