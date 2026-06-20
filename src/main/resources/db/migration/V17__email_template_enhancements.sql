-- V17__email_template_enhancements.sql

ALTER TABLE email_template
ADD COLUMN category VARCHAR(50),
ADD COLUMN created_by_id BIGINT,
ADD COLUMN is_shared BOOLEAN DEFAULT false,
ADD COLUMN open_count INT DEFAULT 0,
ADD COLUMN click_count INT DEFAULT 0,
ADD COLUMN reply_count INT DEFAULT 0,
ADD COLUMN sent_count INT DEFAULT 0;

ALTER TABLE email_template
ADD CONSTRAINT fk_email_template_created_by
FOREIGN KEY (created_by_id)
REFERENCES users (id) ON DELETE SET NULL;
