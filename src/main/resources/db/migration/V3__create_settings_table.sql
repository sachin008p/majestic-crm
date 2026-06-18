CREATE TABLE settings (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,

    company_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(100),
    address VARCHAR(500),
    website VARCHAR(255),

    email_leads BOOLEAN,
    email_tasks BOOLEAN,
    email_customers BOOLEAN,
    task_reminders BOOLEAN,
    lead_updates BOOLEAN,

    theme VARCHAR(50)
);