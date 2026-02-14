# Sight-Sign Project Context
**Last Updated:** January 4, 2026
**Status:** Development Environment Fully Operational

## Project Overview
Sight-Sign is a construction site safety induction system using QR codes for worker check-in/check-out with integrated OSHA safety quizzes.

**Tech Stack:**
- Next.js 14 (App Router)
- Supabase (PostgreSQL + Auth + Realtime)
- TypeScript
- TailwindCSS

## Current Project State

### ✅ Working Components
1. **Authentication System**
   - Worker registration (with auto sign-in fix)
   - Login for both worker and admin accounts
   - Supabase Auth integration

2. **Worker Dashboard** (`/worker/dashboard`)
   - Displays worker's unique QR code
   - Profile information (name, company, phone)
   - QR code download functionality
   - Instructions for site usage
   - Recent sign-ins section (UI ready, data pending)

3. **Admin Dashboard** (`/admin/dashboard`)
   - Purple-themed admin portal with sidebar navigation
   - Dashboard statistics (Total Sites: 1)
   - Site management interface
   - "Scan QR" functionality for worker check-in
   - Auto sign-out time display (18:00:00)

### 📊 Database Status
All 6 tables created and operational:
- `workers` - 2 test accounts created
- `sites` - 1 test site ("Demo Construction Site")
- `site_admins` - 1 admin role assigned
- `sign_ins` - Empty (ready for testing)
- `quiz_questions` - 5 OSHA questions seeded
- `quiz_responses` - Empty (ready for testing)

**Supabase Project:** https://iqkldpatrwvnknyzbwej.supabase.co

### 🔑 Test Accounts

**Worker Account:**
- Email: `worker@test.local`
- Password: `TestPass123!`
- UUID: `79034be3-8d67-4eff-9e45-c74d00061640`
- Dashboard: http://localhost:3000/worker/dashboard

**Admin Account:**
- Email: `admin@test.local`
- Password: `AdminPass123!`
- UUID: `39092eb3-0da2-4513-a36b-9e6a04043a81`
- Dashboard: http://localhost:3000/admin/dashboard

**Test Site:**
- ID: `00000000-0000-0000-0000-000000000001`
- Name: "Demo Construction Site"
- Address: "123 Main St, Demo City"
- Auto sign-out: 18:00:00

## Issues Resolved

### 1. RLS Infinite Recursion (CRITICAL FIX)
**Problem:** `site_admins` table policy caused infinite recursion
**Solution:** Simplified policy to `USING (true)` for MVP development
```sql
DROP POLICY IF EXISTS "Admins can view site admins" ON site_admins;
CREATE POLICY "Admins can view all site admins"
  ON site_admins FOR SELECT
  USING (true);
```

### 2. Email Confirmation Blocking Registration
**Problem:** Supabase email confirmation requirement blocked test accounts
**Solution:** Created test accounts using service role key with `email_confirm: true`
**Script:** `create-test-users-direct.js`

### 3. Worker Profile Creation Failed
**Problem:** Registration created auth user but not worker profile (RLS violation)
**Solution:** Modified registration flow in `/app/auth/register/page.tsx`:
- Added `signInWithPassword` after `signUp` to establish session
- Worker profile insert now succeeds with authenticated session

## Key Files

### Configuration
- `.env.local` - Supabase credentials (URL, anon key, service role key)
- `supabase/all-migrations.sql` - Complete database schema (455 lines)

### Authentication
- `app/auth/register/page.tsx` - Worker registration (fixed with sign-in step)
- `app/auth/login/page.tsx` - Login page
- `lib/supabase/client.ts` - Supabase client setup

### Dashboards
- `app/worker/dashboard/page.tsx` - Worker QR code and profile display
- `app/admin/dashboard/page.tsx` - Admin site management interface

### Utilities
- `create-test-users-direct.js` - Script to create test accounts bypassing email
- `check-tables.js` - Database verification script
- `lib/utils/qr-code.ts` - QR code hash generation

## Next Steps for Development

### Immediate Testing (Week 1)
1. **Test QR Code Scanning Flow**
   - Click "Scan QR" button on admin dashboard
   - Test scanning worker QR code
   - Verify worker sign-in recorded in `sign_ins` table

2. **Test Safety Quiz**
   - Trigger quiz during sign-in process
   - Verify quiz questions display correctly
   - Test quiz response submission
   - Check passing/failing logic (4/5 questions required)

3. **Test Auto Sign-Out**
   - Verify workers are signed out at configured time (18:00:00)
   - Test cron job or scheduled function

### Feature Completion (Week 2)
4. **Implement Live Features**
   - "Workers On-Site" real-time count
   - "Today's Sign-Ins" statistics
   - "Recent Sign-Ins" history display

5. **Add Site Management**
   - Create new sites functionality
   - Edit site details
   - Configure auto sign-out times per site

6. **Worker Features**
   - View personal sign-in history
   - View quiz scores
   - Update profile information

### Future Enhancements
7. **Reporting & Analytics**
   - Worker attendance reports
   - Quiz performance analytics
   - Site usage statistics

8. **Notifications**
   - Email confirmations for sign-ins
   - Quiz failure notifications
   - Auto sign-out reminders

## Running the Project

```bash
# Start development server
cd /Users/cob/Aivax/Brain2/sight-sign
npm run dev

# Development server running at: http://localhost:3000

# Create additional test accounts (if needed)
node create-test-users-direct.js

# Verify database tables
node check-tables.js
```

## Environment Variables Required
```
NEXT_PUBLIC_SUPABASE_URL=https://iqkldpatrwvnknyzbwej.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon key]
SUPABASE_SERVICE_ROLE_KEY=[service role key]
```

## Known Limitations (MVP)

1. **Email Validation:** Using `.test.local` domains for development (not production-ready)
2. **RLS Policies:** Simplified for MVP - needs proper multi-tenant isolation for production
3. **QR Code Scanning:** Browser-based implementation (camera access required)
4. **Real-time Features:** Marked as "Live in Week 2" on admin dashboard
5. **Password Requirements:** Basic validation only (6+ characters)

## Production Readiness Checklist

- [ ] Implement proper email validation
- [ ] Strengthen RLS policies for multi-tenant security
- [ ] Add comprehensive error handling
- [ ] Implement rate limiting
- [ ] Add audit logging
- [ ] Configure production email provider
- [ ] Set up automated backups
- [ ] Add monitoring and alerting
- [ ] Implement HTTPS in production
- [ ] Add terms of service and privacy policy

---

**Development Server:** Running on port 3000
**Database:** Supabase PostgreSQL (all tables operational)
**Authentication:** Working for both worker and admin roles
**Next Session:** Continue with QR scanning flow testing
