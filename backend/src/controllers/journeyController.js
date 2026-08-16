const db = require("../config/db");


// Get all available connections
const getJourneys = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                c.connection_id,
                c.from_location_id,
                from_loc.name AS from_location,
                c.to_location_id,
                to_loc.name AS to_location,
                c.distance_m,
                c.direction,
                c.travel_type,
                c.is_accessible,
                c.is_estimated
            FROM connections c
            JOIN locations from_loc
                ON c.from_location_id = from_loc.location_id
            JOIN locations to_loc
                ON c.to_location_id = to_loc.location_id
            ORDER BY c.connection_id
        `);

        res.status(200).json(rows);

    } catch (error) {
        console.error("Journey API error:", error.message);

        res.status(500).json({
            message: "Failed to fetch journey data"
        });
    }
};


// Find shortest route between two locations
const findRoute = async (req, res) => {
    try {
        const { from, to, accessible } = req.query;

        if (!from || !to) {
            return res.status(400).json({
                message: "from and to location IDs are required"
            });
        }

        const start = Number(from);
        const destination = Number(to);

        if (isNaN(start) || isNaN(destination)) {
            return res.status(400).json({
                message: "from and to must be valid location IDs"
            });
        }

        // Get all connections
        let query = `
            SELECT
                c.connection_id,
                c.from_location_id,
                c.to_location_id,
                c.distance_m,
                c.direction,
                c.travel_type,
                c.is_accessible,
                c.is_estimated,
                from_loc.name AS from_location,
                to_loc.name AS to_location
            FROM connections c
            JOIN locations from_loc
                ON c.from_location_id = from_loc.location_id
            JOIN locations to_loc
                ON c.to_location_id = to_loc.location_id
        `;

        // If accessible=true, only use accessible connections
        if (accessible === "true") {
            query += `
                WHERE c.is_accessible = TRUE
            `;
        }

        const [connections] = await db.query(query);

        // Build graph
        const graph = {};

        for (const connection of connections) {

            if (!graph[connection.from_location_id]) {
                graph[connection.from_location_id] = [];
            }

            graph[connection.from_location_id].push(connection);
        }

        // Check locations
        if (!graph[start] && start !== destination) {
            return res.status(404).json({
                message: "Starting location has no available route"
            });
        }

        // Dijkstra algorithm
        const distances = {};
        const previous = {};
        const visited = new Set();

        for (const connection of connections) {
            distances[connection.from_location_id] = Infinity;
            distances[connection.to_location_id] = Infinity;
        }

        distances[start] = 0;

        while (true) {

            let current = null;
            let smallestDistance = Infinity;

            for (const locationId in distances) {

                if (
                    !visited.has(Number(locationId)) &&
                    distances[locationId] < smallestDistance
                ) {
                    smallestDistance = distances[locationId];
                    current = Number(locationId);
                }
            }

            if (current === null) {
                break;
            }

            if (current === destination) {
                break;
            }

            visited.add(current);

            const neighbors = graph[current] || [];

            for (const edge of neighbors) {

                const next = edge.to_location_id;

                if (visited.has(next)) {
                    continue;
                }

                const newDistance =
                    distances[current] +
                    Number(edge.distance_m);

                if (newDistance < distances[next]) {

                    distances[next] = newDistance;

                    previous[next] = {
                        locationId: current,
                        connection: edge
                    };
                }
            }
        }

        // No route found
        if (distances[destination] === undefined ||
            distances[destination] === Infinity) {

            return res.status(404).json({
                message: "No route found between these locations"
            });
        }

        // Reconstruct route
        const route = [];
        let current = destination;

        while (current !== start) {

            const previousNode = previous[current];

            if (!previousNode) {
                break;
            }

            route.unshift(previousNode.connection);

            current = previousNode.locationId;
        }

        res.status(200).json({
            from: start,
            to: destination,
            accessible: accessible === "true",
            total_distance_m: Number(distances[destination].toFixed(2)),
            steps: route.map((step, index) => ({
                step: index + 1,
                from_location_id: step.from_location_id,
                from_location: step.from_location,
                to_location_id: step.to_location_id,
                to_location: step.to_location,
                distance_m: Number(step.distance_m),
                direction: step.direction,
                travel_type: step.travel_type,
                accessible: Boolean(step.is_accessible),
                estimated: Boolean(step.is_estimated)
            }))
        });

    } catch (error) {

        console.error("Route API error:", error.message);

        res.status(500).json({
            message: "Failed to calculate route"
        });
    }
};


module.exports = {
    getJourneys,
    findRoute
};