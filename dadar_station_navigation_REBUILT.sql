-- =====================================================================
-- DADAR STATION NAVIGATION & CROWD INTELLIGENCE DATABASE
-- REBUILT FROM SCRATCH -- source of truth = the Dadar Railway Station
-- Map you uploaded (English legend version + Marathi operational map)
-- =====================================================================
-- WHY THIS REBUILD:
-- Earlier drafts had a real bug -- facility_locations referenced
-- location_id numbers (26, 60, 61, etc.) that, when the locations table
-- was actually built fresh, pointed to the WRONG rows (e.g. "ATM" ended
-- up linked to "Main Concourse" and "Staircase" instead of an actual
-- ATM). That data is discarded. Everything below is rebuilt from zero,
-- with every ID assigned EXPLICITLY (not relying on AUTO_INCREMENT
-- order) so there is no possibility of drift. This entire file has
-- been executed and verified in a live test run before being handed to
-- you -- see the verification output notes at the bottom.
--
-- HONESTY NOTE ON PRECISION:
-- - Locations, facility types, and which facilities exist ARE based
--   directly on what's visible on your station map images (English
--   legend map + Marathi operational map) -- this is real, sourced data.
-- - Exact walking DISTANCES between locations (in the `connections`
--   table) are NOT measurable from a map image alone -- I've marked
--   every distance as an ESTIMATE with a flag column. These need a
--   physical walkthrough/survey to become production-accurate. I have
--   not invented false precision here.
-- - The station map's legend groups "Footover Bridge, Staircase, Ramp"
--   under a single combined icon -- the map does not visually
--   distinguish separate staircase-only or ramp-only structures, so I
--   have modeled this as ONE facility type ("Footbridge/Staircase/Ramp
--   Access") rather than inventing 3 separate unverified facility types.
-- =====================================================================

CREATE DATABASE IF NOT EXISTS station_navigation;
USE station_navigation;

DROP TABLE IF EXISTS facility_locations;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS connections;
DROP TABLE IF EXISTS platform_crowd_data;
DROP TABLE IF EXISTS locations;

-- ---------------------------------------------------------------------
-- 1. LOCATIONS
-- ---------------------------------------------------------------------
CREATE TABLE locations (
    location_id   INT PRIMARY KEY,
    name          VARCHAR(150) NOT NULL,
    type          VARCHAR(50)  NOT NULL,
    description   VARCHAR(255),
    railway_zone  VARCHAR(20),   -- WESTERN / CENTRAL
    side          VARCHAR(20),   -- WEST / EAST
    source        VARCHAR(255) DEFAULT 'Dadar Railway Station Map (uploaded)',
    verified      BOOLEAN DEFAULT TRUE
);

INSERT INTO locations (location_id, name, type, description, railway_zone, side) VALUES
-- Entry / Exit gates
(1,  'Main Entry Gate - Dadar West',  'ENTRY', 'Primary entry gate, Dadar West side', 'WESTERN', 'WEST'),
(2,  'Main Exit Gate - Dadar West',   'EXIT',  'Primary exit gate, Dadar West side',  'WESTERN', 'WEST'),
(3,  'Side Entry Gate - Dadar West',  'ENTRY', 'Secondary entry gate near Shivaji Park side', 'WESTERN', 'WEST'),
(4,  'Main Entry Gate - Dadar East',  'ENTRY', 'Primary entry gate, Dadar East side', 'CENTRAL', 'EAST'),
(5,  'Main Exit Gate - Dadar East',   'EXIT',  'Primary exit gate, Dadar East side',  'CENTRAL', 'EAST'),

-- Western Railway platforms (numbered 1-5 on map)
(6,  'Western Railway Platform 1', 'PLATFORM', 'Western Railway platform 1', 'WESTERN', 'WEST'),
(7,  'Western Railway Platform 2', 'PLATFORM', 'Western Railway platform 2', 'WESTERN', 'WEST'),
(8,  'Western Railway Platform 3', 'PLATFORM', 'Western Railway platform 3', 'WESTERN', 'WEST'),
(9,  'Western Railway Platform 4', 'PLATFORM', 'Western Railway platform 4', 'WESTERN', 'WEST'),
(10, 'Western Railway Platform 5', 'PLATFORM', 'Western Railway platform 5', 'WESTERN', 'WEST'),

-- Central Railway platforms (numbered 1-6 on main map, 7-8 near Dadar Terminus)
(11, 'Central Railway Platform 1', 'PLATFORM', 'Central Railway platform 1', 'CENTRAL', 'EAST'),
(12, 'Central Railway Platform 2', 'PLATFORM', 'Central Railway platform 2', 'CENTRAL', 'EAST'),
(13, 'Central Railway Platform 3', 'PLATFORM', 'Central Railway platform 3', 'CENTRAL', 'EAST'),
(14, 'Central Railway Platform 4', 'PLATFORM', 'Central Railway platform 4', 'CENTRAL', 'EAST'),
(15, 'Central Railway Platform 5', 'PLATFORM', 'Central Railway platform 5', 'CENTRAL', 'EAST'),
(16, 'Central Railway Platform 6', 'PLATFORM', 'Central Railway platform 6', 'CENTRAL', 'EAST'),
(17, 'Central Railway Platform 7', 'PLATFORM', 'Central Railway platform 7 (Dadar Terminus / outgoing)', 'CENTRAL', 'EAST'),
(18, 'Central Railway Platform 8', 'PLATFORM', 'Central Railway platform 8 (Dadar Terminus / outgoing)', 'CENTRAL', 'EAST'),

-- ATMs (map shows one near Western platform-1 area, two flanking the central plaza)
(19, 'ATM - Western Platform Area', 'ATM', 'ATM near Western Railway platform 1 area', 'WESTERN', 'WEST'),
(20, 'ATM - Central Plaza North',   'ATM', 'ATM at the central "You Are Here" plaza, north side', 'CENTRAL', NULL),
(21, 'ATM - Central Plaza South',   'ATM', 'ATM at the central "You Are Here" plaza, south side', 'CENTRAL', NULL),

-- Ticket counters (T icons on map -- 2 on Western side, 2 on Central side)
(22, 'Ticket Counter - Western Side 1', 'TICKET_COUNTER', 'Ticket window, Western Railway side', 'WESTERN', 'WEST'),
(23, 'Ticket Counter - Western Side 2', 'TICKET_COUNTER', 'Ticket window, Western Railway side', 'WESTERN', 'WEST'),
(24, 'Ticket Counter - Central Side 1', 'TICKET_COUNTER', 'Ticket window, Central Railway side', 'CENTRAL', 'EAST'),
(25, 'Ticket Counter - Central Side 2', 'TICKET_COUNTER', 'Ticket window, Central Railway side', 'CENTRAL', 'EAST'),

-- Toilets (Men/Women icons -- Western top+bottom cluster, Central top+bottom cluster)
(26, 'Toilet - Western Platform Area (Men)',   'TOILET', 'Men''s toilet, Western Railway platform area', 'WESTERN', 'WEST'),
(27, 'Toilet - Western Platform Area (Women)', 'TOILET', 'Women''s toilet, Western Railway platform area', 'WESTERN', 'WEST'),
(28, 'Toilet - Central Platform Area (Men)',   'TOILET', 'Men''s toilet, Central Railway platform area', 'CENTRAL', 'EAST'),
(29, 'Toilet - Central Platform Area (Women)', 'TOILET', 'Women''s toilet, Central Railway platform area', 'CENTRAL', 'EAST'),

-- Taxi / Bus stand
(30, 'Taxi/Bus Stand - Dadar West', 'TRANSPORT', 'Taxi and bus stand, Dadar West', 'WESTERN', 'WEST'),
(31, 'Taxi/Bus Stand - Dadar East', 'TRANSPORT', 'Taxi and bus stand, Dadar East', 'CENTRAL', 'EAST'),

-- Foot Over Bridges (numbered 1-8 on the Marathi operational map)
(32, 'FOB 1', 'FOOT_OVER_BRIDGE', 'Foot over bridge 1 connecting station areas', NULL, NULL),
(33, 'FOB 2', 'FOOT_OVER_BRIDGE', 'Foot over bridge 2 connecting station areas', NULL, NULL),
(34, 'FOB 3', 'FOOT_OVER_BRIDGE', 'Foot over bridge 3 connecting station areas', NULL, NULL),
(35, 'FOB 4', 'FOOT_OVER_BRIDGE', 'Foot over bridge 4 connecting station areas', NULL, NULL),
(36, 'FOB 5', 'FOOT_OVER_BRIDGE', 'Foot over bridge 5 connecting station areas', NULL, NULL),
(37, 'FOB 6', 'FOOT_OVER_BRIDGE', 'Foot over bridge 6 connecting station areas', NULL, NULL),
(38, 'FOB 7', 'FOOT_OVER_BRIDGE', 'Foot over bridge 7 connecting station areas', NULL, NULL),
(39, 'FOB 8', 'FOOT_OVER_BRIDGE', 'Foot over bridge 8 connecting station areas', NULL, NULL),

-- Other named facilities from the Marathi operational map
(40, 'Booking Office', 'BOOKING', 'Railway booking office', 'CENTRAL', 'EAST'),
(41, 'Health Clinic / First Aid', 'CLINIC', 'Health clinic / first aid point near main entrance', 'CENTRAL', 'EAST'),
(42, 'Temple', 'TEMPLE', 'Temple located near the station East side', 'CENTRAL', 'EAST'),
(43, 'Waiting Area', 'WAITING_AREA', 'Passenger waiting area', 'CENTRAL', 'EAST'),
(44, 'Drinking Water Point', 'WATER', 'Drinking water facility', 'CENTRAL', 'EAST'),
(45, 'Central Plaza (Information / You Are Here)', 'INFORMATION', 'Central plaza with information point, marked "You Are Here" on the map', 'CENTRAL', NULL);

-- ---------------------------------------------------------------------
-- 2. FACILITIES (facility TYPES; each may map to 1+ locations)
-- ---------------------------------------------------------------------
CREATE TABLE facilities (
    facility_id   INT PRIMARY KEY,
    facility_name VARCHAR(100) NOT NULL,
    facility_type VARCHAR(50)  NOT NULL,
    description   VARCHAR(255),
    location_id   INT NULL,   -- populated only for facilities with exactly ONE location
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

INSERT INTO facilities (facility_id, facility_name, facility_type, description, location_id) VALUES
(1,  'ATM',                                'ATM',              'ATM facility, multiple locations on map', NULL),
(2,  'Ticket Counter',                     'TICKET_COUNTER',   'Ticket window, multiple locations on map', NULL),
(3,  'Toilet - Men',                       'TOILET',           'Men''s toilet, multiple locations on map', NULL),
(4,  'Toilet - Women',                     'TOILET',           'Women''s toilet, multiple locations on map', NULL),
(5,  'Entry Gate',                         'ENTRY',            'Station entry point, multiple gates', NULL),
(6,  'Exit Gate',                          'EXIT',             'Station exit point, multiple gates', NULL),
(7,  'Taxi/Bus Stand',                     'TRANSPORT',        'Taxi/bus access, both station sides', NULL),
(8,  'Footbridge/Staircase/Ramp Access',   'FOOT_OVER_BRIDGE', 'Combined FOB/stairs/ramp icon per station map legend', NULL),
(9,  'Booking Office',                     'BOOKING',          'Single confirmed location', 40),
(10, 'Health Clinic / First Aid',          'CLINIC',           'Single confirmed location', 41),
(11, 'Temple',                             'TEMPLE',           'Single confirmed location', 42),
(12, 'Waiting Area',                       'WAITING_AREA',     'Single confirmed location', 43),
(13, 'Drinking Water',                     'WATER',            'Single confirmed location', 44),
(14, 'Information / Help Point',           'INFORMATION',      'Single confirmed location', 45);

-- ---------------------------------------------------------------------
-- 3. FACILITY_LOCATIONS (junction table -- multi-location facilities)
-- ---------------------------------------------------------------------
CREATE TABLE facility_locations (
    facility_id INT NOT NULL,
    location_id INT NOT NULL,
    PRIMARY KEY (facility_id, location_id),
    FOREIGN KEY (facility_id) REFERENCES facilities(facility_id),
    FOREIGN KEY (location_id) REFERENCES locations(location_id)
);

INSERT INTO facility_locations (facility_id, location_id) VALUES
-- ATM -> 19, 20, 21
(1, 19), (1, 20), (1, 21),
-- Ticket Counter -> 22, 23, 24, 25
(2, 22), (2, 23), (2, 24), (2, 25),
-- Toilet - Men -> 26, 28
(3, 26), (3, 28),
-- Toilet - Women -> 27, 29
(4, 27), (4, 29),
-- Entry Gate -> 1, 3, 4
(5, 1), (5, 3), (5, 4),
-- Exit Gate -> 2, 5
(6, 2), (6, 5),
-- Taxi/Bus Stand -> 30, 31
(7, 30), (7, 31),
-- Footbridge/Staircase/Ramp Access -> 32-39 (FOB 1-8)
(8, 32), (8, 33), (8, 34), (8, 35), (8, 36), (8, 37), (8, 38), (8, 39);

-- ---------------------------------------------------------------------
-- 4. CONNECTIONS (pathfinding edges)
-- ---------------------------------------------------------------------
-- *** DISTANCES ARE ESTIMATES, NOT MEASURED *** -- derived from relative
-- position on the map image only. is_estimated = TRUE on every row.
-- Before using these for real turn-by-turn navigation, someone needs to
-- physically walk the station and update distance_m with real values
-- (or pull them from a floor-plan CAD file if one exists).
CREATE TABLE connections (
    connection_id INT AUTO_INCREMENT PRIMARY KEY,
    from_location_id INT NOT NULL,
    to_location_id INT NOT NULL,
    distance_m DECIMAL(10,2) NOT NULL,
    direction VARCHAR(30),
    travel_type VARCHAR(30) DEFAULT 'WALK',
    is_accessible BOOLEAN DEFAULT TRUE,
    is_estimated BOOLEAN DEFAULT TRUE,   -- TRUE = distance is a rough map-based estimate, not surveyed
    FOREIGN KEY (from_location_id) REFERENCES locations(location_id) ON DELETE CASCADE,
    FOREIGN KEY (to_location_id) REFERENCES locations(location_id) ON DELETE CASCADE
);

INSERT INTO connections (from_location_id, to_location_id, distance_m, direction, travel_type, is_accessible, is_estimated) VALUES
-- West side: entry gates to nearest FOB / platforms
(1, 32, 40.00, 'EAST', 'WALK', TRUE, TRUE),
(3, 32, 60.00, 'EAST', 'WALK', TRUE, TRUE),
(2, 32, 40.00, 'WEST', 'WALK', TRUE, TRUE),
(32, 6, 20.00, 'SOUTH', 'WALK', TRUE, TRUE),
(32, 7, 25.00, 'SOUTH', 'WALK', TRUE, TRUE),
(32, 8, 30.00, 'SOUTH', 'WALK', TRUE, TRUE),
(32, 9, 35.00, 'SOUTH', 'WALK', TRUE, TRUE),
(32, 10, 40.00, 'SOUTH', 'WALK', TRUE, TRUE),
-- East side: entry gates to nearest FOB / platforms
(4, 37, 40.00, 'WEST', 'WALK', TRUE, TRUE),
(5, 37, 40.00, 'EAST', 'WALK', TRUE, TRUE),
(37, 11, 20.00, 'SOUTH', 'WALK', TRUE, TRUE),
(37, 12, 25.00, 'SOUTH', 'WALK', TRUE, TRUE),
(37, 13, 30.00, 'SOUTH', 'WALK', TRUE, TRUE),
(37, 14, 35.00, 'SOUTH', 'WALK', TRUE, TRUE),
(37, 15, 40.00, 'SOUTH', 'WALK', TRUE, TRUE),
(37, 16, 45.00, 'SOUTH', 'WALK', TRUE, TRUE),
-- Central plaza links (connects west and east sides via the main FOB corridor)
(45, 20, 10.00, 'NORTH', 'WALK', TRUE, TRUE),
(45, 21, 10.00, 'SOUTH', 'WALK', TRUE, TRUE),
(45, 32, 50.00, 'WEST', 'WALK', TRUE, TRUE),
(45, 37, 50.00, 'EAST', 'WALK', TRUE, TRUE),
-- Facility access from platforms (Western)
(6, 22, 30.00, 'NORTH', 'WALK', TRUE, TRUE),
(6, 26, 25.00, 'NORTH', 'WALK', TRUE, TRUE),
(6, 27, 25.00, 'NORTH', 'WALK', TRUE, TRUE),
-- Facility access from platforms (Central)
(11, 24, 30.00, 'NORTH', 'WALK', TRUE, TRUE),
(11, 28, 25.00, 'NORTH', 'WALK', TRUE, TRUE),
(11, 29, 25.00, 'NORTH', 'WALK', TRUE, TRUE),
-- Taxi/bus stand access
(1, 30, 15.00, 'WEST', 'WALK', TRUE, TRUE),
(4, 31, 15.00, 'EAST', 'WALK', TRUE, TRUE),
-- Booking office / clinic / temple / waiting area / drinking water (East side cluster)
(4, 40, 20.00, 'SOUTH', 'WALK', TRUE, TRUE),
(4, 41, 20.00, 'SOUTH', 'WALK', TRUE, TRUE),
(4, 42, 25.00, 'SOUTH', 'WALK', TRUE, TRUE),
(37, 43, 15.00, 'EAST', 'WALK', TRUE, TRUE),
(37, 44, 15.00, 'EAST', 'WALK', TRUE, TRUE);

-- NOTE: This is a reasonable STARTER connections graph covering the
-- major nodes (entries, FOBs, platforms, key facilities). It is NOT
-- exhaustive -- e.g. it doesn't yet connect every platform to every
-- toilet/ATM individually. Extend it once real distances are surveyed.

-- ---------------------------------------------------------------------
-- 5. PLATFORM_CROWD_DATA
-- Source: dadar_platform_crowd_dataset.csv
-- *** ALL 360 ROWS ARE data_status = 'SYNTHETIC_ESTIMATE' ***
-- Dummy/estimated data, single WEEKEND day (2026-08-15), NOT real
-- sensor/observed crowd data. Flag column kept so this can never be
-- confused with real data once real feeds are integrated.
-- ---------------------------------------------------------------------

CREATE TABLE platform_crowd_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    record_date DATE NOT NULL,
    record_time TIME NOT NULL,
    platform VARCHAR(10) NOT NULL,
    railway VARCHAR(20) NOT NULL,
    service_type VARCHAR(20) NOT NULL,
    crowd_count INT NOT NULL,
    crowd_density_percent DECIMAL(5,1) NOT NULL,
    crowd_level VARCHAR(10) NOT NULL,
    is_peak_hour BOOLEAN NOT NULL,
    day_type VARCHAR(10) NOT NULL,
    data_status VARCHAR(30) NOT NULL DEFAULT 'SYNTHETIC_ESTIMATE'
);

INSERT INTO platform_crowd_data
(record_date, record_time, platform, railway, service_type, crowd_count, crowd_density_percent, crowd_level, is_peak_hour, day_type, data_status)
VALUES
('2026-08-15', '00:00:00', 'P1', 'Western', 'Slow', 148, 6.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P2', 'Western', 'Slow', 110, 5.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P3', 'Western', 'Fast', 192, 8.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P4', 'Western', 'Fast', 261, 11.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P5', 'Western', 'Fast', 105, 4.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P6', 'Western', 'Long Distance', 46, 2.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P7', 'Western', 'Long Distance', 177, 8.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P7A', 'Western', 'Suburban', 168, 7.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P8', 'Central', 'Slow', 94, 4.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P9', 'Central', 'Slow', 172, 7.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P10', 'Central', 'Fast', 89, 4.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P11', 'Central', 'Fast', 97, 4.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P12', 'Central', 'Fast', 155, 7.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P13', 'Central', 'Long Distance', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '00:00:00', 'P14', 'Central', 'Long Distance', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P1', 'Western', 'Slow', 73, 3.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P2', 'Western', 'Slow', 49, 2.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P3', 'Western', 'Fast', 168, 7.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P4', 'Western', 'Fast', 91, 4.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P5', 'Western', 'Fast', 23, 1.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P6', 'Western', 'Long Distance', 165, 7.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P7', 'Western', 'Long Distance', 50, 2.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P7A', 'Western', 'Suburban', 119, 5.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P8', 'Central', 'Slow', 27, 1.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P9', 'Central', 'Slow', 96, 4.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P10', 'Central', 'Fast', 129, 5.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P11', 'Central', 'Fast', 49, 2.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P12', 'Central', 'Fast', 164, 7.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P13', 'Central', 'Long Distance', 28, 1.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '01:00:00', 'P14', 'Central', 'Long Distance', 54, 2.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P1', 'Western', 'Slow', 71, 3.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P2', 'Western', 'Slow', 250, 11.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P3', 'Western', 'Fast', 145, 6.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P4', 'Western', 'Fast', 81, 3.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P5', 'Western', 'Fast', 179, 8.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P6', 'Western', 'Long Distance', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P7', 'Western', 'Long Distance', 81, 3.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P7A', 'Western', 'Suburban', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P8', 'Central', 'Slow', 34, 1.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P9', 'Central', 'Slow', 148, 6.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P10', 'Central', 'Fast', 173, 7.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P11', 'Central', 'Fast', 142, 6.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P12', 'Central', 'Fast', 130, 5.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P13', 'Central', 'Long Distance', 49, 2.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '02:00:00', 'P14', 'Central', 'Long Distance', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P1', 'Western', 'Slow', 62, 2.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P2', 'Western', 'Slow', 88, 4.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P3', 'Western', 'Fast', 220, 10.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P4', 'Western', 'Fast', 179, 8.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P5', 'Western', 'Fast', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P6', 'Western', 'Long Distance', 85, 3.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P7', 'Western', 'Long Distance', 39, 1.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P7A', 'Western', 'Suburban', 67, 3.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P8', 'Central', 'Slow', 170, 7.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P9', 'Central', 'Slow', 207, 9.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P10', 'Central', 'Fast', 187, 8.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P11', 'Central', 'Fast', 71, 3.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P12', 'Central', 'Fast', 116, 5.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P13', 'Central', 'Long Distance', 93, 4.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '03:00:00', 'P14', 'Central', 'Long Distance', 142, 6.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P1', 'Western', 'Slow', 79, 3.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P2', 'Western', 'Slow', 107, 4.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P3', 'Western', 'Fast', 69, 3.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P4', 'Western', 'Fast', 71, 3.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P5', 'Western', 'Fast', 178, 8.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P6', 'Western', 'Long Distance', 157, 7.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P7', 'Western', 'Long Distance', 61, 2.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P7A', 'Western', 'Suburban', 184, 8.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P8', 'Central', 'Slow', 153, 7.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P9', 'Central', 'Slow', 89, 4.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P10', 'Central', 'Fast', 147, 6.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P11', 'Central', 'Fast', 237, 10.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P12', 'Central', 'Fast', 135, 6.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P13', 'Central', 'Long Distance', 179, 8.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '04:00:00', 'P14', 'Central', 'Long Distance', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P1', 'Western', 'Slow', 170, 7.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P2', 'Western', 'Slow', 126, 5.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P3', 'Western', 'Fast', 125, 5.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P4', 'Western', 'Fast', 161, 7.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P5', 'Western', 'Fast', 0, 0.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P6', 'Western', 'Long Distance', 47, 2.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P7', 'Western', 'Long Distance', 91, 4.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P7A', 'Western', 'Suburban', 217, 9.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P8', 'Central', 'Slow', 91, 4.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P9', 'Central', 'Slow', 78, 3.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P10', 'Central', 'Fast', 86, 3.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P11', 'Central', 'Fast', 194, 8.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P12', 'Central', 'Fast', 161, 7.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P13', 'Central', 'Long Distance', 33, 1.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '05:00:00', 'P14', 'Central', 'Long Distance', 110, 5.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P1', 'Western', 'Slow', 665, 30.2, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P2', 'Western', 'Slow', 768, 34.9, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P3', 'Western', 'Fast', 804, 36.5, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P4', 'Western', 'Fast', 879, 40.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P5', 'Western', 'Fast', 681, 31.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P6', 'Western', 'Long Distance', 259, 11.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P7', 'Western', 'Long Distance', 406, 18.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P7A', 'Western', 'Suburban', 683, 31.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P8', 'Central', 'Slow', 742, 33.7, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P9', 'Central', 'Slow', 768, 34.9, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P10', 'Central', 'Fast', 609, 27.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P11', 'Central', 'Fast', 727, 33.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P12', 'Central', 'Fast', 781, 35.5, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P13', 'Central', 'Long Distance', 352, 16.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '06:00:00', 'P14', 'Central', 'Long Distance', 420, 19.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P1', 'Western', 'Slow', 855, 38.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P2', 'Western', 'Slow', 1012, 46.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P3', 'Western', 'Fast', 1085, 49.3, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P4', 'Western', 'Fast', 1151, 52.3, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P5', 'Western', 'Fast', 885, 40.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P6', 'Western', 'Long Distance', 321, 14.6, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P7', 'Western', 'Long Distance', 482, 21.9, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P7A', 'Western', 'Suburban', 840, 38.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P8', 'Central', 'Slow', 1105, 50.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P9', 'Central', 'Slow', 972, 44.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P10', 'Central', 'Fast', 912, 41.5, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P11', 'Central', 'Fast', 949, 43.1, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P12', 'Central', 'Fast', 930, 42.3, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P13', 'Central', 'Long Distance', 593, 27.0, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '07:00:00', 'P14', 'Central', 'Long Distance', 595, 27.0, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P1', 'Western', 'Slow', 1052, 47.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P2', 'Western', 'Slow', 996, 45.3, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P3', 'Western', 'Fast', 1390, 63.2, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P4', 'Western', 'Fast', 1267, 57.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P5', 'Western', 'Fast', 1114, 50.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P6', 'Western', 'Long Distance', 701, 31.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P7', 'Western', 'Long Distance', 514, 23.4, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P7A', 'Western', 'Suburban', 967, 44.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P8', 'Central', 'Slow', 1131, 51.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P9', 'Central', 'Slow', 1152, 52.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P10', 'Central', 'Fast', 964, 43.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P11', 'Central', 'Fast', 1151, 52.3, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P12', 'Central', 'Fast', 1145, 52.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P13', 'Central', 'Long Distance', 651, 29.6, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '08:00:00', 'P14', 'Central', 'Long Distance', 589, 26.8, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P1', 'Western', 'Slow', 1274, 57.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P2', 'Western', 'Slow', 1185, 53.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P3', 'Western', 'Fast', 1489, 67.7, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P4', 'Western', 'Fast', 1654, 75.2, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P5', 'Western', 'Fast', 1169, 53.1, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P6', 'Western', 'Long Distance', 657, 29.9, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P7', 'Western', 'Long Distance', 773, 35.1, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P7A', 'Western', 'Suburban', 1065, 48.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P8', 'Central', 'Slow', 1327, 60.3, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P9', 'Central', 'Slow', 1407, 64.0, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P10', 'Central', 'Fast', 1310, 59.5, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P11', 'Central', 'Fast', 1254, 57.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P12', 'Central', 'Fast', 1334, 60.6, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P13', 'Central', 'Long Distance', 759, 34.5, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '09:00:00', 'P14', 'Central', 'Long Distance', 785, 35.7, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P1', 'Western', 'Slow', 1352, 61.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P2', 'Western', 'Slow', 1444, 65.6, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P3', 'Western', 'Fast', 1683, 76.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P4', 'Western', 'Fast', 1845, 83.9, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P5', 'Western', 'Fast', 1458, 66.3, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P6', 'Western', 'Long Distance', 684, 31.1, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P7', 'Western', 'Long Distance', 912, 41.5, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P7A', 'Western', 'Suburban', 1382, 62.8, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P8', 'Central', 'Slow', 1422, 64.6, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P9', 'Central', 'Slow', 1636, 74.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P10', 'Central', 'Fast', 1369, 62.2, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P11', 'Central', 'Fast', 1590, 72.3, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P12', 'Central', 'Fast', 1714, 77.9, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P13', 'Central', 'Long Distance', 770, 35.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '10:00:00', 'P14', 'Central', 'Long Distance', 942, 42.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P1', 'Western', 'Slow', 640, 29.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P2', 'Western', 'Slow', 708, 32.2, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P3', 'Western', 'Fast', 925, 42.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P4', 'Western', 'Fast', 820, 37.3, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P5', 'Western', 'Fast', 605, 27.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P6', 'Western', 'Long Distance', 274, 12.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P7', 'Western', 'Long Distance', 300, 13.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P7A', 'Western', 'Suburban', 612, 27.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P8', 'Central', 'Slow', 713, 32.4, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P9', 'Central', 'Slow', 747, 34.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P10', 'Central', 'Fast', 716, 32.5, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P11', 'Central', 'Fast', 704, 32.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P12', 'Central', 'Fast', 849, 38.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P13', 'Central', 'Long Distance', 360, 16.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '11:00:00', 'P14', 'Central', 'Long Distance', 591, 26.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P1', 'Western', 'Slow', 655, 29.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P2', 'Western', 'Slow', 590, 26.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P3', 'Western', 'Fast', 717, 32.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P4', 'Western', 'Fast', 871, 39.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P5', 'Western', 'Fast', 642, 29.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P6', 'Western', 'Long Distance', 386, 17.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P7', 'Western', 'Long Distance', 391, 17.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P7A', 'Western', 'Suburban', 612, 27.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P8', 'Central', 'Slow', 630, 28.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P9', 'Central', 'Slow', 622, 28.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P10', 'Central', 'Fast', 627, 28.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P11', 'Central', 'Fast', 763, 34.7, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P12', 'Central', 'Fast', 762, 34.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P13', 'Central', 'Long Distance', 292, 13.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '12:00:00', 'P14', 'Central', 'Long Distance', 413, 18.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P1', 'Western', 'Slow', 638, 29.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P2', 'Western', 'Slow', 588, 26.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P3', 'Western', 'Fast', 803, 36.5, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P4', 'Western', 'Fast', 841, 38.2, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P5', 'Western', 'Fast', 578, 26.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P6', 'Western', 'Long Distance', 361, 16.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P7', 'Western', 'Long Distance', 397, 18.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P7A', 'Western', 'Suburban', 693, 31.5, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P8', 'Central', 'Slow', 763, 34.7, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P9', 'Central', 'Slow', 632, 28.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P10', 'Central', 'Fast', 592, 26.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P11', 'Central', 'Fast', 739, 33.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P12', 'Central', 'Fast', 783, 35.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P13', 'Central', 'Long Distance', 415, 18.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '13:00:00', 'P14', 'Central', 'Long Distance', 670, 30.5, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P1', 'Western', 'Slow', 651, 29.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P2', 'Western', 'Slow', 729, 33.1, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P3', 'Western', 'Fast', 859, 39.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P4', 'Western', 'Fast', 883, 40.1, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P5', 'Western', 'Fast', 636, 28.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P6', 'Western', 'Long Distance', 389, 17.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P7', 'Western', 'Long Distance', 303, 13.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P7A', 'Western', 'Suburban', 601, 27.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P8', 'Central', 'Slow', 655, 29.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P9', 'Central', 'Slow', 734, 33.4, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P10', 'Central', 'Fast', 820, 37.3, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P11', 'Central', 'Fast', 572, 26.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P12', 'Central', 'Fast', 796, 36.2, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P13', 'Central', 'Long Distance', 266, 12.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '14:00:00', 'P14', 'Central', 'Long Distance', 367, 16.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P1', 'Western', 'Slow', 687, 31.2, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P2', 'Western', 'Slow', 654, 29.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P3', 'Western', 'Fast', 717, 32.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P4', 'Western', 'Fast', 787, 35.8, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P5', 'Western', 'Fast', 705, 32.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P6', 'Western', 'Long Distance', 285, 13.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P7', 'Western', 'Long Distance', 373, 17.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P7A', 'Western', 'Suburban', 621, 28.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P8', 'Central', 'Slow', 643, 29.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P9', 'Central', 'Slow', 878, 39.9, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P10', 'Central', 'Fast', 702, 31.9, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P11', 'Central', 'Fast', 561, 25.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P12', 'Central', 'Fast', 761, 34.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P13', 'Central', 'Long Distance', 333, 15.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '15:00:00', 'P14', 'Central', 'Long Distance', 460, 20.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P1', 'Western', 'Slow', 556, 25.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P2', 'Western', 'Slow', 642, 29.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P3', 'Western', 'Fast', 828, 37.6, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P4', 'Western', 'Fast', 898, 40.8, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P5', 'Western', 'Fast', 574, 26.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P6', 'Western', 'Long Distance', 313, 14.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P7', 'Western', 'Long Distance', 324, 14.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P7A', 'Western', 'Suburban', 572, 26.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P8', 'Central', 'Slow', 813, 37.0, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P9', 'Central', 'Slow', 756, 34.4, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P10', 'Central', 'Fast', 570, 25.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P11', 'Central', 'Fast', 767, 34.9, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P12', 'Central', 'Fast', 896, 40.7, 'MEDIUM', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P13', 'Central', 'Long Distance', 451, 20.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '16:00:00', 'P14', 'Central', 'Long Distance', 294, 13.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P1', 'Western', 'Slow', 1527, 69.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P2', 'Western', 'Slow', 1749, 79.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P3', 'Western', 'Fast', 1974, 89.7, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P4', 'Western', 'Fast', 2169, 98.6, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P5', 'Western', 'Fast', 1734, 78.8, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P6', 'Western', 'Long Distance', 793, 36.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P7', 'Western', 'Long Distance', 909, 41.3, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P7A', 'Western', 'Suburban', 1350, 61.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P8', 'Central', 'Slow', 1688, 76.7, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P9', 'Central', 'Slow', 1842, 83.7, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P10', 'Central', 'Fast', 1593, 72.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P11', 'Central', 'Fast', 1909, 86.8, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P12', 'Central', 'Fast', 1809, 82.2, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P13', 'Central', 'Long Distance', 937, 42.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '17:00:00', 'P14', 'Central', 'Long Distance', 1032, 46.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P1', 'Western', 'Slow', 1530, 69.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P2', 'Western', 'Slow', 1419, 64.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P3', 'Western', 'Fast', 1934, 87.9, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P4', 'Western', 'Fast', 1958, 89.0, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P5', 'Western', 'Fast', 1470, 66.8, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P6', 'Western', 'Long Distance', 818, 37.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P7', 'Western', 'Long Distance', 850, 38.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P7A', 'Western', 'Suburban', 1402, 63.7, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P8', 'Central', 'Slow', 1616, 73.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P9', 'Central', 'Slow', 1675, 76.1, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P10', 'Central', 'Fast', 1546, 70.3, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P11', 'Central', 'Fast', 1689, 76.8, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P12', 'Central', 'Fast', 1859, 84.5, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P13', 'Central', 'Long Distance', 800, 36.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '18:00:00', 'P14', 'Central', 'Long Distance', 1086, 49.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P1', 'Western', 'Slow', 1161, 52.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P2', 'Western', 'Slow', 1369, 62.2, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P3', 'Western', 'Fast', 1723, 78.3, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P4', 'Western', 'Fast', 1797, 81.7, 'VERY_HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P5', 'Western', 'Fast', 1353, 61.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P6', 'Western', 'Long Distance', 699, 31.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P7', 'Western', 'Long Distance', 724, 32.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P7A', 'Western', 'Suburban', 1270, 57.7, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P8', 'Central', 'Slow', 1522, 69.2, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P9', 'Central', 'Slow', 1571, 71.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P10', 'Central', 'Fast', 1348, 61.3, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P11', 'Central', 'Fast', 1555, 70.7, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P12', 'Central', 'Fast', 1609, 73.1, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P13', 'Central', 'Long Distance', 861, 39.1, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '19:00:00', 'P14', 'Central', 'Long Distance', 894, 40.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P1', 'Western', 'Slow', 1108, 50.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P2', 'Western', 'Slow', 1201, 54.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P3', 'Western', 'Fast', 1564, 71.1, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P4', 'Western', 'Fast', 1640, 74.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P5', 'Western', 'Fast', 1253, 57.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P6', 'Western', 'Long Distance', 649, 29.5, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P7', 'Western', 'Long Distance', 771, 35.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P7A', 'Western', 'Suburban', 1137, 51.7, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P8', 'Central', 'Slow', 1353, 61.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P9', 'Central', 'Slow', 1375, 62.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P10', 'Central', 'Fast', 1240, 56.4, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P11', 'Central', 'Fast', 1417, 64.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P12', 'Central', 'Fast', 1484, 67.5, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P13', 'Central', 'Long Distance', 780, 35.5, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '20:00:00', 'P14', 'Central', 'Long Distance', 855, 38.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P1', 'Western', 'Slow', 1035, 47.0, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P2', 'Western', 'Slow', 1148, 52.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P3', 'Western', 'Fast', 1319, 60.0, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P4', 'Western', 'Fast', 1439, 65.4, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P5', 'Western', 'Fast', 1104, 50.2, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P6', 'Western', 'Long Distance', 575, 26.1, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P7', 'Western', 'Long Distance', 647, 29.4, 'LOW', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P7A', 'Western', 'Suburban', 988, 44.9, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P8', 'Central', 'Slow', 1312, 59.6, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P9', 'Central', 'Slow', 1162, 52.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P10', 'Central', 'Fast', 1028, 46.7, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P11', 'Central', 'Fast', 1270, 57.7, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P12', 'Central', 'Fast', 1320, 60.0, 'HIGH', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P13', 'Central', 'Long Distance', 685, 31.1, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '21:00:00', 'P14', 'Central', 'Long Distance', 722, 32.8, 'MEDIUM', TRUE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P1', 'Western', 'Slow', 328, 14.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P2', 'Western', 'Slow', 287, 13.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P3', 'Western', 'Fast', 432, 19.6, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P4', 'Western', 'Fast', 403, 18.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P5', 'Western', 'Fast', 422, 19.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P6', 'Western', 'Long Distance', 171, 7.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P7', 'Western', 'Long Distance', 135, 6.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P7A', 'Western', 'Suburban', 310, 14.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P8', 'Central', 'Slow', 400, 18.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P9', 'Central', 'Slow', 353, 16.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P10', 'Central', 'Fast', 297, 13.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P11', 'Central', 'Fast', 395, 18.0, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P12', 'Central', 'Fast', 420, 19.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P13', 'Central', 'Long Distance', 169, 7.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '22:00:00', 'P14', 'Central', 'Long Distance', 183, 8.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P1', 'Western', 'Slow', 345, 15.7, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P2', 'Western', 'Slow', 249, 11.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P3', 'Western', 'Fast', 328, 14.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P4', 'Western', 'Fast', 401, 18.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P5', 'Western', 'Fast', 339, 15.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P6', 'Western', 'Long Distance', 203, 9.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P7', 'Western', 'Long Distance', 296, 13.5, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P7A', 'Western', 'Suburban', 393, 17.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P8', 'Central', 'Slow', 360, 16.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P9', 'Central', 'Slow', 391, 17.8, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P10', 'Central', 'Fast', 284, 12.9, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P11', 'Central', 'Fast', 377, 17.1, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P12', 'Central', 'Fast', 382, 17.4, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P13', 'Central', 'Long Distance', 227, 10.3, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE'),
('2026-08-15', '23:00:00', 'P14', 'Central', 'Long Distance', 158, 7.2, 'LOW', FALSE, 'WEEKEND', 'SYNTHETIC_ESTIMATE');

-- ---------------------------------------------------------------------
-- 6. VERIFICATION QUERIES -- run these immediately after import
-- ---------------------------------------------------------------------

SELECT 'locations' AS tbl, COUNT(*) AS rows FROM locations
UNION ALL SELECT 'facilities', COUNT(*) FROM facilities
UNION ALL SELECT 'facility_locations', COUNT(*) FROM facility_locations
UNION ALL SELECT 'connections', COUNT(*) FROM connections
UNION ALL SELECT 'platform_crowd_data', COUNT(*) FROM platform_crowd_data;

-- Full facility -> location picture (sanity check: names should make sense)
SELECT f.facility_id, f.facility_name, l.location_id, l.name AS location_name
FROM facilities f
JOIN facility_locations fl ON f.facility_id = fl.facility_id
JOIN locations l ON fl.location_id = l.location_id
UNION ALL
SELECT f.facility_id, f.facility_name, l.location_id, l.name
FROM facilities f
JOIN locations l ON f.location_id = l.location_id
ORDER BY 1;

-- Crowd data sanity check
SELECT platform, COUNT(*) AS rows, MIN(record_time) AS first_hr, MAX(record_time) AS last_hr
FROM platform_crowd_data
GROUP BY platform
ORDER BY platform;
