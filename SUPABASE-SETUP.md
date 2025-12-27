# Supabase Database Setup Guide
**Project:** Sight-Sign
**Generated:** 2025-12-28
**Version:** 1.0

---

## Overview

This guide walks you through setting up your Supabase database for the Sight-Sign application, including:

- Creating a Supabase project
- Running database migrations
- Configuring Row Level Security (RLS)
- Enabling Realtime subscriptions
- Setting up environment variables
- Testing the database

**Estimated Time:** 15-20 minutes

---

## Step 1: Create Supabase Account & Project

### 1.1 Sign Up for Supabase

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (recommended) or email
4. Verify your email if required

### 1.2 Create New Project

1. Click **"New Project"**
2. Select your organization (or create one)
3. Fill in project details:
   - **Name:** `sight-sign` (or any name you prefer)
   - **Database Password:** Generate a strong password and **save it securely**
   - **Region:** Choose closest to your users (e.g., `us-east-1`)
   - **Pricing Plan:** Select **Free** tier for development
4. Click **"Create new project"**
5. Wait 2-3 minutes for project provisioning

---

## Step 2: Get Your API Credentials

### 2.1 Copy API Keys

1. In your Supabase project dashboard, go to **Settings** (gear icon) → **API**
2. Copy the following values:

   **Project URL:**
   ```
   https://your-project-id.supabase.co
   ```

   **anon / public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

   **service_role key (secret):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

⚠️ **IMPORTANT:** Keep the `service_role` key secret! Never commit it to version control.

---

## Step 3: Configure Environment Variables

### 3.1 Create `.env.local` File

In your project root (`/Users/cob/Aivax/Brain2/sight-sign/`), create `.env.local`:

```bash
cp .env.local.example .env.local
```

### 3.2 Update `.env.local` with Your Credentials

Open `.env.local` and replace the placeholder values:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3.3 Verify `.env.local` is Ignored

Check that `.env.local` is in your `.gitignore`:

```bash
cat .gitignore | grep .env.local
```

You should see:
```
.env.local
```

✅ **Environment variables configured!**

---

## Step 4: Run Database Migrations

### 4.1 Open Supabase SQL Editor

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **"New query"**

### 4.2 Run Migration 1: Initial Schema

1. Open `supabase/migrations/20250101000001_initial_schema.sql`
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **"Run"** (or press `Cmd + Enter`)
5. Verify success: You should see "Success. No rows returned"

**What this creates:**
- `workers` table
- `sites` table
- `site_admins` table
- `sign_ins` table (with Realtime enabled)
- `quiz_questions` table
- `quiz_responses` table
- Indexes for performance

### 4.3 Run Migration 2: RLS Policies

1. Click **"New query"** again
2. Open `supabase/migrations/20250101000002_rls_policies.sql`
3. Copy and paste into SQL Editor
4. Click **"Run"**
5. Verify success

**What this creates:**
- Row Level Security (RLS) policies for all tables
- Workers can only see their own data
- Admins can see data for their managed sites

### 4.4 Run Migration 3: Seed Quiz Questions

1. Click **"New query"** again
2. Open `supabase/migrations/20250101000003_seed_quiz_questions.sql`
3. Copy and paste into SQL Editor
4. Click **"Run"**
5. You should see: "Seeded 5 global quiz questions" in the output

**What this creates:**
- 5 OSHA-based global safety quiz questions

---

## Step 5: Enable Realtime Subscriptions

### 5.1 Enable Realtime for `sign_ins` Table

1. Go to **Database** → **Replication** (left sidebar)
2. Find the **supabase_realtime** publication
3. Click the toggle to enable it if not already enabled
4. Find `sign_ins` table in the list
5. Check the box next to `sign_ins` to enable Realtime
6. Click **"Save"**

**Why?** This allows the admin dashboard to receive live updates when workers sign in.

---

## Step 6: Verify Database Setup

### 6.1 Check Tables Were Created

1. Go to **Table Editor** (left sidebar)
2. You should see these tables:
   - `workers`
   - `sites`
   - `site_admins`
   - `sign_ins`
   - `quiz_questions`
   - `quiz_responses`

### 6.2 Verify Quiz Questions Seeded

1. Click on **`quiz_questions`** table
2. You should see **5 rows** of quiz questions
3. Check that `site_id` is `NULL` for all 5 (global questions)

### 6.3 Verify RLS is Enabled

1. Go to **Authentication** → **Policies** (left sidebar)
2. You should see RLS policies for each table:
   - `workers`: 4 policies
   - `sites`: 3 policies
   - `site_admins`: 3 policies
   - `sign_ins`: 4 policies
   - `quiz_questions`: 3 policies
   - `quiz_responses`: 3 policies

✅ **Database setup complete!**

---

## Step 7: Test Database Connection (Optional)

### 7.1 Create Test Connection File

Create `test-supabase.js` in your project root:

```javascript
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

async function testConnection() {
  console.log('Testing Supabase connection...')

  // Test 1: Fetch quiz questions
  const { data, error } = await supabase
    .from('quiz_questions')
    .select('*')

  if (error) {
    console.error('❌ Connection failed:', error.message)
  } else {
    console.log('✅ Connection successful!')
    console.log(`✅ Found ${data.length} quiz questions`)
    console.log('First question:', data[0]?.question_text)
  }
}

testConnection()
```

### 7.2 Run Test

```bash
npm install  # Install dependencies if not already done
node test-supabase.js
```

**Expected output:**
```
Testing Supabase connection...
✅ Connection successful!
✅ Found 5 quiz questions
First question: What is the minimum height that requires fall protection?
```

### 7.3 Clean Up

```bash
rm test-supabase.js
```

---

## Common Issues & Solutions

### Issue: "relation does not exist"

**Solution:** Make sure you ran all 3 migration files in order.

### Issue: "RLS policy violation"

**Solution:**
- Check that RLS policies were created (Step 4.3)
- Make sure you're using the correct Supabase client (anon key for client, service_role for admin operations)

### Issue: Environment variables not loading

**Solution:**
- Verify `.env.local` exists in project root
- Restart your Next.js dev server: `npm run dev`
- Check variable names match exactly (case-sensitive)

### Issue: Realtime not working

**Solution:**
- Verify `sign_ins` table is enabled in Database → Replication
- Check that Realtime is enabled for your project (Settings → API → Realtime)

---

## Next Steps

Now that your database is set up:

1. **Start development server:**
   ```bash
   npm run dev
   ```

2. **Begin implementation:**
   - Follow `NEXT-STEPS.md` for Week 1 tasks
   - Start with worker registration form
   - Implement QR code generation

3. **Create test admin account:**
   - Later you'll create an admin user through Supabase Auth
   - Then manually insert a record into `site_admins` to grant admin access

---

## Reference

### Database Schema Overview

```
auth.users (Supabase managed)
   ↓ 1:1
workers (id, name, company, qr_code_hash)
   ↓ 1:N
sign_ins (worker_id, site_id, quiz_completed)
   ↓ 1:N
quiz_responses (sign_in_id, question_id, is_correct)

sites (name, address, auto_signout_time)
   ↓ M:N
site_admins (site_id, admin_id, role)
   ↓
auth.users (admins)
```

### Key Supabase Features Used

- **Supabase Auth:** User authentication and management
- **PostgreSQL 15:** Relational database with ACID guarantees
- **Row Level Security:** Multi-tenant data isolation
- **Realtime Subscriptions:** Live dashboard updates
- **Edge Functions:** Auto sign-out cron job (Phase 2)

---

**Database setup complete! Ready to build the MVP.** 🚀

**Generated for:** Sight-Sign v1.0
**Documentation:** `/Users/cob/Aivax/Brain2/ultrathink-docs/sight-sign/`
