CREATE TABLE quarantine_zones (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);