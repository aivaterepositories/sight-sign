const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

async function checkTables() {
  console.log('\n🔍 Checking Database Tables...\n')

  const tables = ['workers', 'sites', 'site_admins', 'sign_ins', 'quiz_questions', 'quiz_responses']

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1)

      if (error) {
        console.log(`❌ ${table}: Does not exist (${error.code})`)
      } else {
        const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
        console.log(`✅ ${table}: Exists (${count || 0} rows)`)
      }
    } catch (e) {
      console.log(`❌ ${table}: Error - ${e.message}`)
    }
  }

  console.log('\n')
}

checkTables()
