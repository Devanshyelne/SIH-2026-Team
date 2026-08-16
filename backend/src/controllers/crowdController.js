const db = require("../config/db");

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
        console.error("Crowd API error:", error.message);

        res.status(500).json({
            message: "Failed to fetch crowd data"
        });
    }
};

module.exports = {
    getCrowdData
};