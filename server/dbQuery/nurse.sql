CREATE TABLE nurses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    license_number VARCHAR(50),
    dob VARCHAR(255),
    age INT,
    status TINYINT(1) DEFAULT 1
);