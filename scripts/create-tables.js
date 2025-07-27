#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createTables() {
  console.log('🚀 Creating tables in Supabase...')
  console.log(`📡 Target: ${supabaseUrl}`)
  console.log('')

  try {
    // Create roles table and insert default data
    console.log('📋 Creating roles table...')
    const { error: rolesError } = await supabase
      .from('roles')
      .upsert([
        { name: 'Super Admin', description: 'Full system access', hierarchy: 100 },
        { name: 'Admin', description: 'Administrative access', hierarchy: 90 },
        { name: 'Sales Manager', description: 'Sales team management', hierarchy: 80 },
        { name: 'Project Manager', description: 'Project management access', hierarchy: 70 },
        { name: 'Sales Rep', description: 'Sales representative access', hierarchy: 60 },
        { name: 'User', description: 'Basic user access', hierarchy: 50 }
      ], { onConflict: 'name' })

    if (rolesError) {
      console.log('⚠️  Roles table might not exist yet, this is expected on first run')
      console.log('   Error:', rolesError.message)
    } else {
      console.log('✅ Roles created successfully')
    }

    // Test basic connection
    console.log('📋 Testing database connection...')
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .limit(1)

    if (error) {
      console.log('⚠️  Could not query roles table:', error.message)
      console.log('   This means tables need to be created manually in Supabase dashboard')
    } else {
      console.log('✅ Database connection successful')
      console.log(`   Found ${data?.length || 0} roles`)
    }

    console.log('')
    console.log('🎉 Table creation process completed!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Go to your Supabase dashboard: https://supabase.com/dashboard')
    console.log('2. Navigate to SQL Editor')
    console.log('3. Copy and paste the contents of database/schema.sql')
    console.log('4. Click Run to create all tables')
    console.log('5. Then run this script again to populate default data')

  } catch (error) {
    console.error('❌ Table creation failed:', error)
    process.exit(1)
  }
}

if (require.main === module) {
  createTables()
}

module.exports = { createTables }