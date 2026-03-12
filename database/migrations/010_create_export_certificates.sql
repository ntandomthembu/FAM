CREATE TABLE export_certificates (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    certificate_number VARCHAR(255) NOT NULL UNIQUE,
    issue_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id) ON DELETE CASCADE
);