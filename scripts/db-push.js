#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQL(sql, description) {
  try {
    console.log(`📋 ${description}...`)
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    let successCount = 0
    let errorCount = 0

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';'
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          console.warn(`⚠️  Warning in statement ${i + 1}: ${error.message}`)
          errorCount++
        } else {
          successCount++
        }
      } catch (err) {
        console.warn(`⚠️  Error in statement ${i + 1}: ${err.message}`)
        errorCount++
      }
    }

    console.log(`✅ ${description} completed: ${successCount} successful, ${errorCount} warnings`)
    return { success: true, successCount, errorCount }
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message)
    return { success: false, error }
  }
}

async function pushDatabase() {
  console.log('🚀 Pushing database schema to Supabase...')
  console.log(`📡 Target: ${supabaseUrl}`)
  console.log('')

  try {
    // Read and execute schema
    const schemaPath = path.join(__dirname, '../database/schema.sql')
    if (fs.existsSync(schemaPath)) {
      const schema = fs.readFileSync(schemaPath, 'utf8')
      await executeSQL(schema, 'Creating database schema')
    } else {
      console.warn('⚠️  Schema file not found, skipping...')
    }

    console.log('')

    // Read and execute RLS policies
    const rlsPath = path.join(__dirname, '../database/rls-policies.sql')
    if (fs.existsSync(rlsPath)) {
      const rlsPolicies = fs.readFileSync(rlsPath, 'utf8')
      await executeSQL(rlsPolicies, 'Setting up Row Level Security policies')
    } else {
      console.warn('⚠️  RLS policies file not found, skipping...')
    }

    console.log('')
    console.log('🎉 Database push completed!')
    console.log('')
    console.log('📝 Next steps:')
    console.log('1. Check your Supabase dashboard to verify tables were created')
    console.log('2. Run: npm run dev')
    console.log('3. Visit: http://localhost:3000/dashboard')
    console.log('4. Test the user management system')

  } catch (error) {
    console.error('❌ Database push failed:', error)
    process.exit(1)
  }
}

// Add to package.json scripts
async function updatePackageJson() {
  const packagePath = path.join(__dirname, '../package.json')
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
    
    if (!packageJson.scripts) {
      packageJson.scripts = {}
    }
    
    packageJson.scripts['db:push'] = 'node scripts/db-push.js'
    packageJson.scripts['db:setup'] = 'node scripts/setup-database.js'
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
    console.log('✅ Added db:push script to package.json')
  } catch (error) {
    console.warn('⚠️  Could not update package.json:', error.message)
  }
}

if (require.main === module) {
  // Check if we should update package.json
  const args = process.argv.slice(2)
  if (args.includes('--setup-scripts')) {
    updatePackageJson()
  } else {
    pushDatabase()
  }
}

module.exports = { pushDatabase, executeSQL }