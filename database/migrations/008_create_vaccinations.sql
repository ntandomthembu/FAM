CREATE TABLE vaccinations (
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    vaccine_id INT NOT NULL,
    date_administered DATE NOT NULL,
    number_of_animals INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES farms(id),
    FOREIGN KEY (vaccine_id) REFERENCES vaccine_stock(id)
);