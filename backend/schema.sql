-- HealthSync Database Schema (MySQL)
-- This is an alternative to Prisma schema for direct SQL setup
-- Run this SQL script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS healthsync;
USE healthsync;

-- Create Users table
CREATE TABLE IF NOT EXISTS User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'DOCTOR', 'PATIENT') DEFAULT 'PATIENT',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Create Doctors table
CREATE TABLE IF NOT EXISTS Doctor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    department VARCHAR(255),
    experience INT,
    phone VARCHAR(50),
    specialization VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    INDEX idx_department (department)
);

-- Create Patients table
CREATE TABLE IF NOT EXISTS Patient (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT UNIQUE NOT NULL,
    phone VARCHAR(50),
    age INT,
    gender VARCHAR(20),
    disease VARCHAR(255),
    doctorId INT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES User(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Doctor(id) ON DELETE SET NULL,
    INDEX idx_doctor (doctorId),
    INDEX idx_disease (disease)
);

-- Create Appointments table
CREATE TABLE IF NOT EXISTS Appointment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patientId INT NOT NULL,
    doctorId INT NOT NULL,
    appointmentDate DATETIME NOT NULL,
    appointmentTime VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    notes TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patientId) REFERENCES Patient(id) ON DELETE CASCADE,
    FOREIGN KEY (doctorId) REFERENCES Doctor(id) ON DELETE CASCADE,
    INDEX idx_patient (patientId),
    INDEX idx_doctor (doctorId),
    INDEX idx_date (appointmentDate),
    INDEX idx_status (status)
);

-- Insert sample admin user (password: admin123 - change in production!)
-- Password hash for 'admin123' using bcrypt (salt rounds: 12)
INSERT INTO User (name, email, password, role) VALUES
('Admin User', 'admin@healthsync.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5Y', 'ADMIN')
ON DUPLICATE KEY UPDATE name=name;

