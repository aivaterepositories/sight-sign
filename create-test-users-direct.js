/**
 * Create Test Users Directly in Supabase
 * Uses service role key to bypass email confirmation
 */

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function createTestAccounts() {
  console.log('\n🔧 Creating Test Accounts for Development\n')
  console.log('═'.repeat(60))

  try {
    // Test credentials
    const workerEmail = 'worker@test.local'
    const workerPassword = 'TestPass123!'
    const adminEmail = 'admin@test.local'
    const adminPassword = 'AdminPass123!'

    console.log('\n📝 Creating Worker Account...')
    const { data: worker, error: workerError } = await supabase.auth.admin.createUser({
      email: workerEmail,
      password: workerPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: 'Demo Worker',
        phone: '(555) 111-2222',
        company: 'Test Construction Co'
      }
    })

    if (workerError) {
      console.error('❌ Worker creation failed:', workerError.message)
    } else {
      console.log(`✅ Worker created: ${worker.user.id}`)
      console.log(`   Email: ${workerEmail}`)
      console.log(`   Password: ${workerPassword}`)

      // Create worker profile
      const { error: workerProfileError } = await supabase.from('workers').insert({
        id: worker.user.id,
        name: 'Demo Worker',
        phone: '(555) 111-2222',
        company: 'Test Construction Co',
        qr_code_hash: 'QR_' + worker.user.id
      })

      if (workerProfileError) {
        console.error('❌ Worker profile creation failed:', workerProfileError.message)
      } else {
        console.log('✅ Worker profile created')
      }
    }

    console.log('\n📝 Creating Admin Account...')
    const { data: admin, error: adminError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        name: 'Demo Admin',
        phone: '(555) 333-4444',
        company: 'Admin Construction Co'
      }
    })

    if (adminError) {
      console.error('❌ Admin creation failed:', adminError.message)
    } else {
      console.log(`✅ Admin created: ${admin.user.id}`)
      console.log(`   Email: ${adminEmail}`)
      console.log(`   Password: ${adminPassword}`)

      // Create admin worker profile
      const { error: adminProfileError } = await supabase.from('workers').insert({
        id: admin.user.id,
        name: 'Demo Admin',
        phone: '(555) 333-4444',
        company: 'Admin Construction Co',
        qr_code_hash: 'QR_' + admin.user.id
      })

      if (adminProfileError) {
        console.error('❌ Admin profile creation failed:', adminProfileError.message)
      } else {
        console.log('✅ Admin profile created')
      }

      // Create test site
      console.log('\n📝 Creating Test Site...')
      const siteId = '00000000-0000-0000-0000-000000000001'
      const { error: siteError } = await supabase.from('sites').insert({
        id: siteId,
        name: 'Demo Construction Site',
        address: '123 Main St, Demo City',
        auto_signout_time: '18:00:00'
      })

      if (siteError && !siteError.message.includes('duplicate')) {
        console.error('❌ Site creation failed:', siteError.message)
      } else {
        console.log('✅ Test site created')
      }

      // Make admin a site admin
      console.log('\n📝 Assigning Admin Role...')
      const { error: adminRoleError } = await supabase.from('site_admins').insert({
        site_id: siteId,
        admin_id: admin.user.id,
        role: 'admin'
      })

      if (adminRoleError) {
        console.error('❌ Admin role assignment failed:', adminRoleError.message)
      } else {
        console.log('✅ Admin role assigned')
      }
    }

    console.log('\n' + '═'.repeat(60))
    console.log('\n🎉 Test Accounts Created!\n')
    console.log('📋 Login Credentials:\n')
    console.log('Worker Account:')
    console.log(`  Email: ${workerEmail}`)
    console.log(`  Password: ${workerPassword}`)
    console.log(`  Dashboard: http://localhost:3000/worker/dashboard\n`)
    console.log('Admin Account:')
    console.log(`  Email: ${adminEmail}`)
    console.log(`  Password: ${adminPassword}`)
    console.log(`  Dashboard: http://localhost:3000/admin/dashboard\n`)

  } catch (err) {
    console.error('\n❌ Fatal error:', err)
  }
}

createTestAccounts()
