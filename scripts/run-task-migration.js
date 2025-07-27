#!/usr/bin/env node

/**
 * Task Management Migration Script
 * 
 * This script safely adds task management tables to the existing database
 * without affecting existing data.
 */

const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

async function runTaskMigration() {
  try {
    console.log('🚀 Starting Task Management Migration...')
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '..', 'migrations', 'add-task-management.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
    
    // Split the SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`)
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`)
      
      try {
        await prisma.$executeRawUnsafe(statement)
        console.log(`✅ Statement ${i + 1} executed successfully`)
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Statement ${i + 1} skipped (already exists)`)
        } else {
          console.error(`❌ Error executing statement ${i + 1}:`, error.message)
          throw error
        }
      }
    }
    
    console.log('🎉 Task Management Migration completed successfully!')
    
    // Verify the tables were created
    console.log('🔍 Verifying migration...')
    
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'task_management%'
      OR table_name = 'recurring_task_management'
    `
    
    console.log('📊 Created tables:', tables.map(t => t.table_name))
    
    // Test basic functionality
    console.log('🧪 Testing basic functionality...')
    
    // Try to count existing users (should work)
    const userCount = await prisma.user.count()
    console.log(`👥 Found ${userCount} existing users`)
    
    console.log('✅ Migration verification completed!')
    
  } catch (error) {
    console.error('💥 Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the migration
runTaskMigration()