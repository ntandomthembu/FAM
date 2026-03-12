CREATE TABLE livestock (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(50),
    age INT,
    health_status VARCHAR(50),
    date_added TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);