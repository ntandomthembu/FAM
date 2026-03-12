CREATE TABLE incidents (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    number_of_animals_affected INT NOT NULL,
    species VARCHAR(255) NOT NULL,
    symptoms TEXT NOT NULL,
    photos TEXT[],
    gps_location GEOGRAPHY(Point, 4326) NOT NULL,
    time_symptoms_started TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'reported',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);