-- Sight-Sign Initial Database Schema
-- Migration: 20250101000001_initial_schema
-- Description: Create core tables for construction site safety induction system
-- Generated: 2025-12-28

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLE: workers
-- Description: Worker profiles extending Supabase Auth users
-- ============================================================================
CREATE TABLE workers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  company TEXT NOT NULL,
  qr_code_hash TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast QR code validation
CREATE INDEX idx_workers_qr_hash ON workers(qr_code_hash);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_workers_updated_at
  BEFORE UPDATE ON workers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: sites
-- Description: Construction sites
-- ============================================================================
CREATE TABLE sites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  auto_signout_time TIME DEFAULT '18:00:00',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: site_admins
-- Description: Junction table for many-to-many relationship between sites and admins
-- ============================================================================
CREATE TABLE site_admins (
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'admin',
  PRIMARY KEY (site_id, admin_id)
);

-- ============================================================================
-- TABLE: sign_ins
-- Description: Worker sign-in events (soft delete pattern with signed_out_at)
-- RLS Enabled, Realtime Subscriptions Enabled
-- ============================================================================
CREATE TABLE sign_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  worker_id UUID NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
  site_id UUID NOT NULL REFERENCES sites(id) ON DELETE CASCADE,
  signed_in_at TIMESTAMPTZ DEFAULT NOW(),
  signed_out_at TIMESTAMPTZ,
  signed_out_method TEXT CHECK (signed_out_method IN ('auto', 'manual', 'admin')),
  quiz_completed BOOLEAN DEFAULT FALSE,
  quiz_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_sign_ins_worker_site ON sign_ins(worker_id, site_id);
-- Partial index for active workers dashboard query
CREATE INDEX idx_sign_ins_active ON sign_ins(site_id) WHERE signed_out_at IS NULL;

-- ============================================================================
-- TABLE: quiz_questions
-- Description: Safety quiz questions (global or site-specific)
-- ============================================================================
CREATE TABLE quiz_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_id UUID REFERENCES sites(id) ON DELETE SET NULL,
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('A', 'B', 'C', 'D')),
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TABLE: quiz_responses
-- Description: Worker quiz responses for audit trail
-- ============================================================================
CREATE TABLE quiz_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sign_in_id UUID NOT NULL REFERENCES sign_ins(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE RESTRICT,
  selected_answer TEXT NOT NULL CHECK (selected_answer IN ('A', 'B', 'C', 'D')),
  is_correct BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REALTIME SUBSCRIPTIONS
-- Enable Realtime for sign_ins table (dashboard live updates)
-- ============================================================================
-- Note: Run this in Supabase Dashboard > Database > Replication
-- ALTER PUBLICATION supabase_realtime ADD TABLE sign_ins;
