-- V8__email_tables.sql

-- Email Templates table
CREATE TABLE email_template (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Email Logs table
CREATE TABLE email_log (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL,
    entity_type VARCHAR(20) NOT NULL CHECK (entity_type IN ('LEAD','CUSTOMER')),
    entity_id BIGINT NOT NULL,
    template_id BIGINT,
    recipient_email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status VARCHAR(10) NOT NULL CHECK (status IN ('SENT','FAILED')),
    error_message VARCHAR(500),
    CONSTRAINT fk_email_log_company FOREIGN KEY (company_id) REFERENCES companies(id),
    CONSTRAINT fk_email_log_template FOREIGN KEY (template_id) REFERENCES email_template(id)
);

-- Index
CREATE INDEX idx_email_log_company_entity ON email_log(company_id, entity_type, entity_id);