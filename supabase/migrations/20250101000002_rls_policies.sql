-- Sight-Sign Row Level Security Policies
-- Migration: 20250101000002_rls_policies
-- Description: Configure RLS policies for multi-tenant data isolation
-- Generated: 2025-12-28

-- ============================================================================
-- ENABLE RLS ON TABLES
-- ============================================================================
ALTER TABLE workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE sign_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- WORKERS TABLE POLICIES
-- ============================================================================

-- Workers can see their own profile
CREATE POLICY "Workers can view own profile"
  ON workers
  FOR SELECT
  USING (auth.uid() = id);

-- Workers can update their own profile
CREATE POLICY "Workers can update own profile"
  ON workers
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can see all workers for their managed sites
CREATE POLICY "Admins can view site workers"
  ON workers
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.admin_id = auth.uid()
    )
  );

-- New workers can create their own profile during registration
CREATE POLICY "Workers can create own profile"
  ON workers
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- SITES TABLE POLICIES
-- ============================================================================

-- Admins can view their managed sites
CREATE POLICY "Admins can view managed sites"
  ON sites
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = id
        AND sa.admin_id = auth.uid()
    )
  );

-- Only admins can create sites (later: only super_admins)
CREATE POLICY "Admins can create sites"
  ON sites
  FOR INSERT
  WITH CHECK (true);  -- Temporary: allow any authenticated user, refine in Phase 2

-- Admins can update their managed sites
CREATE POLICY "Admins can update managed sites"
  ON sites
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- SITE_ADMINS TABLE POLICIES
-- ============================================================================

-- Admins can view their own site assignments
CREATE POLICY "Admins can view own assignments"
  ON site_admins
  FOR SELECT
  USING (admin_id = auth.uid());

-- Admins can view other admins for their managed sites
CREATE POLICY "Admins can view site admins"
  ON site_admins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = site_admins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Only admins can add new admins to their sites
CREATE POLICY "Admins can add site admins"
  ON site_admins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- SIGN_INS TABLE POLICIES
-- ============================================================================

-- Workers can see their own sign-in history
CREATE POLICY "Workers can view own sign-ins"
  ON sign_ins
  FOR SELECT
  USING (worker_id = auth.uid());

-- Admins can see sign-ins for their managed sites
CREATE POLICY "Admins can view site sign-ins"
  ON sign_ins
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = sign_ins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Only admins can create sign-ins (via QR scan)
CREATE POLICY "Admins can create sign-ins"
  ON sign_ins
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = sign_ins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Workers can update their own sign-ins (quiz completion)
CREATE POLICY "Workers can update own sign-ins"
  ON sign_ins
  FOR UPDATE
  USING (worker_id = auth.uid())
  WITH CHECK (worker_id = auth.uid());

-- Admins can update sign-ins for their sites (manual sign-out)
CREATE POLICY "Admins can update site sign-ins"
  ON sign_ins
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = sign_ins.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- QUIZ_QUESTIONS TABLE POLICIES
-- ============================================================================

-- Everyone can view global quiz questions (site_id IS NULL)
CREATE POLICY "Anyone can view global quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (site_id IS NULL);

-- Admins can view site-specific questions for their sites
CREATE POLICY "Admins can view site quiz questions"
  ON quiz_questions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = quiz_questions.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- Admins can create quiz questions for their sites
CREATE POLICY "Admins can create quiz questions"
  ON quiz_questions
  FOR INSERT
  WITH CHECK (
    site_id IS NULL  -- Allow global questions (Phase 2: restrict to super_admins)
    OR EXISTS (
      SELECT 1 FROM site_admins sa
      WHERE sa.site_id = quiz_questions.site_id
        AND sa.admin_id = auth.uid()
    )
  );

-- ============================================================================
-- QUIZ_RESPONSES TABLE POLICIES
-- ============================================================================

-- Workers can view their own quiz responses
CREATE POLICY "Workers can view own quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sign_ins si
      WHERE si.id = quiz_responses.sign_in_id
        AND si.worker_id = auth.uid()
    )
  );

-- Workers can create their own quiz responses
CREATE POLICY "Workers can create own quiz responses"
  ON quiz_responses
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM sign_ins si
      WHERE si.id = sign_in_id
        AND si.worker_id = auth.uid()
    )
  );

-- Admins can view quiz responses for their managed sites
CREATE POLICY "Admins can view site quiz responses"
  ON quiz_responses
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM sign_ins si
      JOIN site_admins sa ON sa.site_id = si.site_id
      WHERE si.id = quiz_responses.sign_in_id
        AND sa.admin_id = auth.uid()
    )
  );
