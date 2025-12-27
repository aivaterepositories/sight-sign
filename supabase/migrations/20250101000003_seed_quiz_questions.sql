-- Sight-Sign Quiz Questions Seed Data
-- Migration: 20250101000003_seed_quiz_questions
-- Description: Seed global OSHA-based safety quiz questions for MVP
-- Generated: 2025-12-28

-- ============================================================================
-- SEED: Global Quiz Questions (5 OSHA-based questions)
-- site_id = NULL means these are global questions for all sites
-- ============================================================================

INSERT INTO quiz_questions (
  site_id,
  question_text,
  option_a,
  option_b,
  option_c,
  option_d,
  correct_answer,
  explanation
) VALUES
  -- Question 1: Fall Protection
  (
    NULL,
    'What is the minimum height that requires fall protection?',
    '4 feet',
    '6 feet',
    '8 feet',
    '10 feet',
    'B',
    'OSHA requires fall protection at 6 feet or higher in construction.'
  ),

  -- Question 2: Equipment Safety
  (
    NULL,
    'What does a red tag on equipment indicate?',
    'Approved for use',
    'Do not operate',
    'Needs maintenance',
    'Reserved for supervisor',
    'B',
    'Red tags mean the equipment is unsafe and should not be used.'
  ),

  -- Question 3: PPE Requirements
  (
    NULL,
    'When must hard hats be worn on a construction site?',
    'Only in hazard zones',
    'Only when overhead work',
    'At all times on site',
    'When required by supervisor',
    'C',
    'Hard hats must be worn at all times on an active construction site.'
  ),

  -- Question 4: Hazard Reporting
  (
    NULL,
    'What should you do if you notice a safety hazard?',
    'Continue working carefully',
    'Report it immediately',
    'Fix it yourself',
    'Mention it at end of day',
    'B',
    'Always report safety hazards immediately to prevent accidents.'
  ),

  -- Question 5: Training Records
  (
    NULL,
    'How long must safety training records be kept?',
    '30 days',
    '6 months',
    '1 year',
    '5 years',
    'D',
    'OSHA requires safety training records to be kept for at least 5 years.'
  );

-- ============================================================================
-- VERIFICATION: Count seeded questions
-- ============================================================================
DO $$
DECLARE
  question_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO question_count FROM quiz_questions WHERE site_id IS NULL;
  RAISE NOTICE 'Seeded % global quiz questions', question_count;
END $$;
