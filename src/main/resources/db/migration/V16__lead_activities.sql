-- V16__lead_activities.sql
-- Create table for lead interactions and activities

CREATE TABLE IF NOT EXISTS lead_activities (
    id BIGSERIAL PRIMARY KEY,
    lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL, -- CALL, EMAIL, MEETING, WEBSITE, NOTE
    notes TEXT,
    created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_activities_lead ON lead_activities(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_activities_type ON lead_activities(activity_type);
