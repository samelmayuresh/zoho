// Simple database connection test
// Run with: node test-db-connection.js

const { PrismaClient } = require('@prisma/client')

const testConnection = async () => {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔌 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test a simple query
    const userCount = await prisma.user.count()
    console.log(`👥 Found ${userCount} users in database`)
    
    // Test finding a specific user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    })
    
    if (adminUser) {
      console.log(`👑 Admin user found: ${adminUser.username} (${adminUser.email})`)
    } else {
      console.log('⚠️ No admin user found - run npm run db:seed')
    }
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
    
    if (error.message.includes("Can't reach database server")) {
      console.log('💡 Possible solutions:')
      console.log('   1. Check your internet connection')
      console.log('   2. Verify Supabase project is active')
      console.log('   3. Check database credentials in .env')
      console.log('   4. Try using DIRECT_URL instead of pooled connection')
    }
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()