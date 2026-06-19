-- V9__user_constraints.sql
-- Add unique constraint on email and must_change_password flag

ALTER TABLE users
    ADD CONSTRAINT uq_user_email UNIQUE (email);

ALTER TABLE users
    ADD COLUMN must_change_password BOOLEAN NOT NULL DEFAULT TRUE;
