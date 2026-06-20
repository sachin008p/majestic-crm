-- V14__add_realistic_mock_data.sql
-- Add realistic mock data for enterprise CRM presentation

-- Ensure Majestic Corp exists
INSERT INTO companies (name, status) VALUES ('Majestic Corp', 'ACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO companies (name, status) VALUES ('TechNova Solutions', 'ACTIVE') ON CONFLICT DO NOTHING;
INSERT INTO companies (name, status) VALUES ('Global Industries', 'ACTIVE') ON CONFLICT DO NOTHING;

-- Insert Realistic Leads
INSERT INTO leads (full_name, phone, email, source, status, assigned_to_id, budget, notes, company_id, created_at)
VALUES 
('Rahul Desai', '+91 9876543210', 'rahul.desai@technova.in', 'Website', 'NEW', (SELECT id FROM users ORDER BY id LIMIT 1), 750000.00, 'Looking for enterprise CRM deployment across 5 branches.', (SELECT id FROM companies WHERE name='TechNova Solutions' LIMIT 1), now() - interval '2 days'),
('Sarah Jenkins', '+1 415-555-0198', 's.jenkins@globalindustries.com', 'Referral', 'NEGOTIATION', (SELECT id FROM users ORDER BY id LIMIT 1), 1200000.00, 'Requires multi-language support and custom integrations.', (SELECT id FROM companies WHERE name='Global Industries' LIMIT 1), now() - interval '15 days'),
('Amit Sharma', '+91 9123456789', 'amit.sharma@startup-india.in', 'LinkedIn', 'CONTACTED', (SELECT id FROM users ORDER BY id LIMIT 1), 500000.00, 'Interested in the standard package with priority support.', (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now() - interval '5 days'),
('Priya Patel', '+91 9988776655', 'priya.patel@retailgiant.com', 'Cold Call', 'WON', (SELECT id FROM users ORDER BY id LIMIT 1), 2500000.00, 'Contract signed for 3 years. Implementation starts next month.', (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now() - interval '30 days'),
('John Doe', '+1 555-0123456', 'johndoe@acmecorp.com', 'Website', 'LOST', (SELECT id FROM users ORDER BY id LIMIT 1), 400000.00, 'Went with competitor due to pricing constraints.', (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now() - interval '45 days'),
('Neha Gupta', '+91 9871234560', 'neha.gupta@fintech-solutions.in', 'Event', 'NEW', (SELECT id FROM users ORDER BY id LIMIT 1), 1500000.00, 'Met at tech summit. Needs demo next week.', (SELECT id FROM companies WHERE name='TechNova Solutions' LIMIT 1), now() - interval '1 day'),
('Michael Chen', '+1 408-555-9876', 'mchen@nextgen-ai.com', 'LinkedIn', 'CONTACTED', (SELECT id FROM users ORDER BY id LIMIT 1), 3000000.00, 'Exploring AI integrations for their sales team.', (SELECT id FROM companies WHERE name='Global Industries' LIMIT 1), now() - interval '10 days'),
('Vikram Singh', '+91 8899001122', 'vsingh@logistics-pro.in', 'Referral', 'NEGOTIATION', (SELECT id FROM users ORDER BY id LIMIT 1), 850000.00, 'Comparing our pricing with Zoho CRM.', (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now() - interval '8 days')
ON CONFLICT DO NOTHING;

-- Insert Realistic Customers
INSERT INTO customers (name, email, phone, address, status, assigned_to_id, company_id, created_at)
VALUES
('TechNova Solutions', 'contact@technova.in', '+91 1800-123-4567', 'Cyber City, Gurugram, Haryana', 'ACTIVE', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM companies WHERE name='TechNova Solutions' LIMIT 1), now() - interval '60 days'),
('Global Industries', 'billing@globalindustries.com', '+1 800-555-9999', '120 Market St, San Francisco, CA', 'ACTIVE', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM companies WHERE name='Global Industries' LIMIT 1), now() - interval '90 days'),
('RetailGiant Pvt Ltd', 'support@retailgiant.com', '+91 80-2345-6789', 'MG Road, Bengaluru, Karnataka', 'ACTIVE', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now() - interval '20 days')
ON CONFLICT (email) DO NOTHING;

-- Insert Realistic Tasks
INSERT INTO tasks (title, description, due_date, status, priority, assigned_to_id, lead_id, company_id, created_at)
VALUES
('Prepare Contract for Sarah Jenkins', 'Draft the enterprise SLA and compliance terms for Global Industries.', now() + interval '2 days', 'PENDING', 'HIGH', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM leads WHERE email='s.jenkins@globalindustries.com' LIMIT 1), (SELECT id FROM companies WHERE name='Global Industries' LIMIT 1), now()),
('Follow up with Rahul Desai', 'Call Rahul to discuss the implementation timeline and server requirements.', now() + interval '1 day', 'PENDING', 'MEDIUM', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM leads WHERE email='rahul.desai@technova.in' LIMIT 1), (SELECT id FROM companies WHERE name='TechNova Solutions' LIMIT 1), now() - interval '1 day'),
('Send Product Demo to Amit', 'Record and send a customized demo of the CRM dashboard.', now() - interval '1 day', 'COMPLETED', 'LOW', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM leads WHERE email='amit.sharma@startup-india.in' LIMIT 1), (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now() - interval '3 days'),
('Schedule Onboarding for RetailGiant', 'Coordinate with Priya Patel to start the onboarding process for their team.', now() + interval '5 days', 'PENDING', 'HIGH', (SELECT id FROM users ORDER BY id LIMIT 1), (SELECT id FROM leads WHERE email='priya.patel@retailgiant.com' LIMIT 1), (SELECT id FROM companies WHERE name='Majestic Corp' LIMIT 1), now())
ON CONFLICT DO NOTHING;
