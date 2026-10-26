-- ============================================================
--  CPMS Database Setup Script
--  Run this in MySQL Workbench or MySQL CLI as root:
--    mysql -u root -p < setup_db.sql
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS cpms_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- 2. Create a dedicated user (optional but recommended)
-- Change 'cpms_user' and 'cpms_pass' to whatever you prefer
CREATE USER IF NOT EXISTS 'cpms_user'@'localhost' IDENTIFIED BY 'cpms_pass';
GRANT ALL PRIVILEGES ON cpms_db.* TO 'cpms_user'@'localhost';
FLUSH PRIVILEGES;

-- 3. Use the database
USE cpms_db;

-- NOTE: Table creation is handled automatically by Hibernate (spring.jpa.hibernate.ddl-auto=update)
-- The tables below will be created on the first run of the backend.
-- This script only creates the database and user.

-- You can verify the setup by running:
-- SHOW DATABASES;
-- SELECT User, Host FROM mysql.user WHERE User='cpms_user';
