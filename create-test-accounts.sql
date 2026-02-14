-- Create Test Accounts for Sight-Sign Development
-- Bypass email confirmation by creating users directly

-- Test Worker Account
-- Email: worker@test.local
-- Password: TestPass123!
-- Encrypted password hash for 'TestPass123!' (you'll need to set this manually in Supabase Auth UI)

-- Test Admin Account
-- Email: admin@test.local
-- Password: AdminPass123!

-- Step 1: Create a test site
INSERT INTO sites (id, name, address, auto_signout_time)
VALUES
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Demo Construction Site', '123 Main St, Demo City', '18:00:00')
ON CONFLICT (id) DO NOTHING;

-- Step 2: You'll need to create these users in Supabase Auth UI first:
-- 1. Go to Authentication → Users → Add User
-- 2. Create worker@test.local with password TestPass123! (disable email confirmation)
-- 3. Create admin@test.local with password AdminPass123! (disable email confirmation)
-- 4. Copy their UUIDs and replace below

-- Step 3: Insert worker records (replace UUIDs with actual ones from Supabase Auth)
-- After creating users, run this:

-- INSERT INTO workers (id, name, phone, company, qr_code_hash)
-- VALUES
--   ('<WORKER_UUID_HERE>', 'Demo Worker', '(555) 111-2222', 'Test Construction Co', 'QR_' || '<WORKER_UUID_HERE>'),
--   ('<ADMIN_UUID_HERE>', 'Demo Admin', '(555) 333-4444', 'Admin Construction Co', 'QR_' || '<ADMIN_UUID_HERE>');

-- Step 4: Make one user an admin
-- INSERT INTO site_admins (site_id, admin_id, role)
-- VALUES
--   ('00000000-0000-0000-0000-000000000001'::uuid, '<ADMIN_UUID_HERE>', 'admin');

-- NOTE: Uncomment and replace UUIDs after creating users in Supabase Auth UI
