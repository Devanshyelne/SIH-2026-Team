const db = require("../config/db");

async function getFacilities(req, res) {
    try {
        const [rows] = await db.query(
            "SELECT * FROM facilities"
        );

        res.status(200).json(rows);

    } catch (error) {
        console.error("Error fetching facilities:", error.message);

        res.status(500).json({
            message: "Failed to fetch facilities"
        });
    }
}

const getFacilitiesByLocation = async (req, res) => {
    try {
        const { locationId } = req.params;

        if (!locationId || isNaN(Number(locationId))) {
            return res.status(400).json({
                message: "Valid location ID is required"
            });
        }

        const [rows] = await db.query(`
            SELECT
                f.facility_id,
                f.facility_name,
                l.location_id,
                l.name AS location_name
            FROM facility_locations fl
            JOIN facilities f
                ON fl.facility_id = f.facility_id
            JOIN locations l
                ON fl.location_id = l.location_id
            WHERE fl.location_id = ?
            
            UNION ALL
            
            SELECT
                f.facility_id,
                f.facility_name,
                l.location_id,
                l.name AS location_name
            FROM facilities f
            JOIN locations l
                ON f.location_id = l.location_id
            WHERE l.location_id = ?
        `, [locationId, locationId]);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Facilities by location error:", error.message);

        res.status(500).json({
            message: "Failed to fetch facilities for this location"
        });
    }
};

module.exports = {
    getFacilities,
    getFacilitiesByLocation
};