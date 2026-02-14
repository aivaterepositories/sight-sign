const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or Service Role Key in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedDemoUsers() {
  console.log('🌱 Starting demo user seed...');

  const users = [
    {
      email: 'demo-worker@sight-sign.com',
      password: 'password123',
      role: 'worker',
      name: 'Demo Worker',
      company: 'Demo Construction Co.',
    },
    {
      email: 'demo-admin@sight-sign.com',
      password: 'password123',
      role: 'admin',
      name: 'Demo Admin',
    }
  ];

  for (const user of users) {
    try {
      console.log(`Processing ${user.email}...`);

      // 1. Check if user exists (by trying to sign in, or list users if we had admin api enabled differently, 
      // but creating and catching error is safer for idempotency with simple auth)
      // Actually with service role we can use listUsers or just try to create and catch
      
      let userId;

      // Try to create the user
      const { data: createdData, error: createError } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true
      });

      if (createError) {
        // If user already exists, we need to find their ID
        if (createError.message.includes('already registered')) {
          console.log(`User ${user.email} already exists. Fetching ID...`);
          // We can't easily "get" the user with simple methods without signing in, 
          // or listing all users (which might be heavy). 
          // Let's list users filtering by email
          const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
          if (listError) throw listError;
          
          const existingUser = listData.users.find(u => u.email === user.email);
          if (!existingUser) throw new Error('User reported existing but could not be found via listUsers');
          userId = existingUser.id;
        } else {
          throw createError;
        }
      } else {
        userId = createdData.user.id;
        console.log(`Created auth user for ${user.email}`);
      }

      // 2. Handle Role Specific Logic
      if (user.role === 'worker') {
        // Access 'workers' table directly
        const { data: existingWorker } = await supabase
          .from('workers')
          .select('id')
          .eq('id', userId)
          .single();

        if (!existingWorker) {
          const { error: workerError } = await supabase
            .from('workers')
            .insert({
              id: userId,
              name: user.name,
              company: user.company,
              qr_code_hash: `demo-hash-${Date.now()}` // Simple unique hash
            });
          
          if (workerError) throw workerError;
          console.log(`Created worker profile for ${user.email}`);
        } else {
          console.log(`Worker profile already exists for ${user.email}`);
        }
      } else if (user.role === 'admin') {
        // Ensure NO worker profile exists (so logic defaults to admin)
         const { error: deleteError } = await supabase
          .from('workers')
          .delete()
          .eq('id', userId);
          
         if (deleteError) console.warn('Could not ensure no worker profile for admin:', deleteError.message);
         console.log(`Ensured no worker profile for ${user.email} (Admin)`);
      }

    } catch (err) {
      console.error(`Error processing ${user.email}:`, err.message);
    }
  }

  console.log('✅ Demo user seeding complete!');
}

seedDemoUsers();
