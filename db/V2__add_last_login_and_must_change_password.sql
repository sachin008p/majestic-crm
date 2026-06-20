-- V2__add_last_login_and_must_change_password.sql
-- Add missing columns to users table to match JPA entity fields
ALTER TABLE users
    ADD COLUMN last_login TIMESTAMP NULL,
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT TRUE;
