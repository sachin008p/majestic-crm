INSERT INTO roles (name)
SELECT 'SUPPORT'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'SUPPORT');

INSERT INTO users (full_name, email, password, phone, role_id, is_active)
SELECT
    'Admin User',
    'admin@majestic.com',
    '$2a$10$0ENUhSk/S1ocBj8/AJN2ge3C8aX4v.D4jjtkDBYtaJXHJy48TVboC',
    '9999999999',
    roles.id,
    true
FROM roles
WHERE roles.name = 'ADMIN'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@majestic.com');

ALTER TABLE customers ADD COLUMN IF NOT EXISTS assigned_to_id BIGINT;
