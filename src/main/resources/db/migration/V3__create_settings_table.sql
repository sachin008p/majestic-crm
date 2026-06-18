CREATE TABLE IF NOT EXISTS settings (
    id BIGSERIAL PRIMARY KEY,

    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    website VARCHAR(255),

    email_leads BOOLEAN NOT NULL DEFAULT false,
    email_tasks BOOLEAN NOT NULL DEFAULT false,
    email_customers BOOLEAN NOT NULL DEFAULT false,
    task_reminders BOOLEAN NOT NULL DEFAULT false,
    lead_updates BOOLEAN NOT NULL DEFAULT false,

    theme VARCHAR(50)
);
