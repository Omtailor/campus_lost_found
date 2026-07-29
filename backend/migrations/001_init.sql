CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_no VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reports (
  id INT AUTO_INCREMENT PRIMARY KEY,
  unique_code VARCHAR(20) NOT NULL UNIQUE,
  student_id INT NOT NULL,
  report_kind ENUM('lost','found') NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  image_url VARCHAR(255) NULL,
  handover_note TEXT NULL,
  status ENUM('pending','resolved') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP NULL,
  CONSTRAINT fk_reports_student
    FOREIGN KEY (student_id) REFERENCES users(id)
    ON DELETE RESTRICT
);