CREATE TABLE movements (
    id SERIAL PRIMARY KEY,
    livestock_id INT NOT NULL,
    source_farm_id INT NOT NULL,
    destination_farm_id INT NOT NULL,
    transport_date TIMESTAMP NOT NULL,
    movement_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (livestock_id) REFERENCES livestock(id),
    FOREIGN KEY (source_farm_id) REFERENCES farms(id),
    FOREIGN KEY (destination_farm_id) REFERENCES farms(id)
);