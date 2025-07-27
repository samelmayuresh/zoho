const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  try {
    console.log('🚀 Setting up Zoho CRM database...')

    // Read schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf8')

    console.log('📋 Creating database schema...')
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      sql: schema
    })

    if (schemaError) {
      console.error('❌ Schema creation failed:', schemaError)
      
      // Try alternative approach - execute schema in parts
      console.log('🔄 Trying alternative approach...')
      const statements = schema.split(';').filter(stmt => stmt.trim())
      
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i].trim()
        if (statement) {
          try {
            const { error } = await supabase.rpc('exec_sql', {
              sql: statement + ';'
            })
            if (error) {
              console.warn(`⚠️  Warning in statement ${i + 1}:`, error.message)
            }
          } catch (err) {
            console.warn(`⚠️  Warning in statement ${i + 1}:`, err.message)
          }
        }
      }
    } else {
      console.log('✅ Database schema created successfully')
    }

    // Read RLS policies file
    const rlsPath = path.join(__dirname, '../database/rls-policies.sql')
    const rlsPolicies = fs.readFileSync(rlsPath, 'utf8')

    console.log('🔒 Setting up Row Level Security policies...')
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: rlsPolicies
    })

    if (rlsError) {
      console.error('❌ RLS policies setup failed:', rlsError)
      
      // Try alternative approach for RLS policies
      console.log('🔄 Trying alternative approach for RLS...')
      const rlsStatements = rlsPolicies.split(';').filter(stmt => stmt.trim())
      
      for (let i = 0; i < rlsStatements.length; i++) {
        const statement = rlsStatements[i].trim()
        if (statement) {
          try {
            const { error } = await supabase.rpc('exec_sql', {
              sql: statement + ';'
            })
            if (error) {
              console.warn(`⚠️  Warning in RLS statement ${i + 1}:`, error.message)
            }
          } catch (err) {
            console.warn(`⚠️  Warning in RLS statement ${i + 1}:`, err.message)
          }
        }
      }
    } else {
      console.log('✅ RLS policies created successfully')
    }

    console.log('🎉 Database setup completed!')
    console.log('\n📝 Next steps:')
    console.log('1. Check your Supabase dashboard to verify tables were created')
    console.log('2. Test the authentication system')
    console.log('3. Start building CRM features')

  } catch (error) {
    console.error('❌ Database setup failed:', error)
    process.exit(1)
  }
}

// Alternative function to create tables manually if RPC doesn't work
async function createTablesManually() {
  console.log('🔧 Creating tables manually...')
  
  const tables = [
    {
      name: 'roles',
      sql: `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL UNIQUE,
          description TEXT,
          hierarchy INTEGER DEFAULT 0,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'user_profiles',
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID PRIMARY KEY,
          first_name VARCHAR(100) NOT NULL,
          last_name VARCHAR(100) NOT NULL,
          role_id UUID REFERENCES roles(id),
          phone VARCHAR(50),
          avatar_url TEXT,
          is_active BOOLEAN DEFAULT true,
          custom_fields JSONB DEFAULT '{}',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `
    }
    // Add more tables as needed
  ]

  for (const table of tables) {
    try {
      const { error } = await supabase.rpc('exec_sql', { sql: table.sql })
      if (error) {
        console.error(`❌ Failed to create ${table.name}:`, error)
      } else {
        console.log(`✅ Created table: ${table.name}`)
      }
    } catch (err) {
      console.error(`❌ Error creating ${table.name}:`, err)
    }
  }
}

if (require.main === module) {
  setupDatabase()
}

module.exports = { setupDatabase, createTablesManually }