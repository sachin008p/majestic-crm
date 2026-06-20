-- V15__expand_lead_fields.sql
-- Add comprehensive tracking and qualification fields to leads table

ALTER TABLE leads
    -- Basic Contact Info (full_name, email, phone already exist)
    ADD COLUMN IF NOT EXISTS company_name VARCHAR(255),
    ADD COLUMN IF NOT EXISTS job_title VARCHAR(150),
    ADD COLUMN IF NOT EXISTS city VARCHAR(100),
    ADD COLUMN IF NOT EXISTS state VARCHAR(100),
    ADD COLUMN IF NOT EXISTS country VARCHAR(100),
    ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255),

    -- Lead Source & Tracking (source already exists)
    ADD COLUMN IF NOT EXISTS campaign_name VARCHAR(150),
    ADD COLUMN IF NOT EXISTS utm_medium VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_source VARCHAR(100),
    ADD COLUMN IF NOT EXISTS utm_campaign VARCHAR(100),

    -- Qualification Data (status, budget already exist)
    ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS industry VARCHAR(150),
    ADD COLUMN IF NOT EXISTS company_size VARCHAR(50),
    ADD COLUMN IF NOT EXISTS annual_revenue NUMERIC(16,2),
    ADD COLUMN IF NOT EXISTS timeline VARCHAR(100),
    ADD COLUMN IF NOT EXISTS pain_points TEXT,

    -- Sales Pipeline Info
    ADD COLUMN IF NOT EXISTS deal_stage VARCHAR(50) DEFAULT 'PROSPECTING',
    ADD COLUMN IF NOT EXISTS probability INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS next_follow_up TIMESTAMP,
    ADD COLUMN IF NOT EXISTS last_contacted TIMESTAMP,

    -- Other Metadata
    ADD COLUMN IF NOT EXISTS tags JSONB,
    ADD COLUMN IF NOT EXISTS custom_fields JSONB,
    ADD COLUMN IF NOT EXISTS duplicate_check_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS gdpr_consent BOOLEAN DEFAULT FALSE;

CREATE INDEX IF NOT EXISTS idx_leads_deal_stage ON leads(deal_stage);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score);
