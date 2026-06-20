-- V13__add_last_login_and_must_change_password.sql
-- Add missing columns to users table to match JPA entity fields
ALTER TABLE users
    ADD COLUMN IF NOT EXISTS last_login TIMESTAMP NULL,
    ADD COLUMN IF NOT EXISTS must_change_password BOOLEAN NOT NULL DEFAULT TRUE;

ALTER TABLE email_template
    ADD COLUMN IF NOT EXISTS company_id BIGINT;
