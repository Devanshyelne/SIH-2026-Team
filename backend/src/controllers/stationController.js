const db = require("../config/db");

async function getStations(req, res) {
    try {
        const [rows] = await db.query(
            "SELECT * FROM locations"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching stations:", error.message);

        res.status(500).json({
            message: "Failed to fetch station data"
        });
    }
}

module.exports = {
    getStations
};