-- V7__company_and_hierarchy.sql
-- Add company model and link it to users, leads, tasks, customers

-- 1. Create companies table (if not exists)
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- 2. Add company_id to users (nullable for existing rows, will be set later)
ALTER TABLE users ADD COLUMN IF NOT EXISTS company_id BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_user_company FOREIGN KEY (company_id) REFERENCES companies(id);

-- 3. Add company_id to leads, tasks, customers
ALTER TABLE leads ADD COLUMN IF NOT EXISTS company_id BIGINT;
ALTER TABLE leads ADD CONSTRAINT fk_lead_company FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS company_id BIGINT;
ALTER TABLE tasks ADD CONSTRAINT fk_task_company FOREIGN KEY (company_id) REFERENCES companies(id);

ALTER TABLE customers ADD COLUMN IF NOT EXISTS company_id BIGINT;
ALTER TABLE customers ADD CONSTRAINT fk_customer_company FOREIGN KEY (company_id) REFERENCES companies(id);

-- 4. Seed a default company for existing data (if none)
INSERT INTO companies (name) VALUES ('Majestic Corp') ON CONFLICT DO NOTHING;

-- 5. Assign existing users/leads/tasks/customers to the default company where NULL
UPDATE users SET company_id = (SELECT id FROM companies WHERE name='Majestic Corp') WHERE company_id IS NULL;
UPDATE leads SET company_id = (SELECT id FROM companies WHERE name='Majestic Corp') WHERE company_id IS NULL;
UPDATE tasks SET company_id = (SELECT id FROM companies WHERE name='Majestic Corp') WHERE company_id IS NULL;
UPDATE customers SET company_id = (SELECT id FROM companies WHERE name='Majestic Corp') WHERE company_id IS NULL;

-- 6. Ensure reporting_to respects company (optional FK cascade)
ALTER TABLE users ADD COLUMN IF NOT EXISTS reporting_to BIGINT;
ALTER TABLE users ADD CONSTRAINT fk_reporting_to_company FOREIGN KEY (reporting_to) REFERENCES users(id) ON DELETE SET NULL;

-- 7. Cleanup: make company_id NOT NULL now that data is populated (optional, can be added later)
-- ALTER TABLE users ALTER COLUMN company_id SET NOT NULL;
-- ALTER TABLE leads ALTER COLUMN company_id SET NOT NULL;
-- ALTER TABLE tasks ALTER COLUMN company_id SET NOT NULL;
-- ALTER TABLE customers ALTER COLUMN company_id SET NOT NULL;
