import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/lib/auth-utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create deal stages
  const dealStages = await Promise.all([
    prisma.dealStage.upsert({
      where: { name: 'Prospecting' },
      update: {},
      create: {
        name: 'Prospecting',
        probability: 10,
        order: 1,
        isWon: false,
        isLost: false
      }
    }),
    prisma.dealStage.upsert({
      where: { name: 'Qualification' },
      update: {},
      create: {
        name: 'Qualification',
        probability: 25,
        order: 2,
        isWon: false,
        isLost: false
      }
    }),
    prisma.dealStage.upsert({
      where: { name: 'Proposal' },
      update: {},
      create: {
        name: 'Proposal',
        probability: 50,
        order: 3,
        isWon: false,
        isLost: false
      }
    }),
    prisma.dealStage.upsert({
      where: { name: 'Negotiation' },
      update: {},
      create: {
        name: 'Negotiation',
        probability: 75,
        order: 4,
        isWon: false,
        isLost: false
      }
    }),
    prisma.dealStage.upsert({
      where: { name: 'Closed Won' },
      update: {},
      create: {
        name: 'Closed Won',
        probability: 100,
        order: 5,
        isWon: true,
        isLost: false
      }
    }),
    prisma.dealStage.upsert({
      where: { name: 'Closed Lost' },
      update: {},
      create: {
        name: 'Closed Lost',
        probability: 0,
        order: 6,
        isWon: false,
        isLost: true
      }
    })
  ])

  console.log('✅ Created deal stages:', dealStages.length)

  // Create a demo admin user for testing
  const adminPassword = await hashPassword('admin123!')
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@zohocrm.com' },
    update: {},
    create: {
      email: 'admin@zohocrm.com',
      username: 'admin_demo',
      password: adminPassword,
      role: Role.ADMIN,
      firstName: 'Admin',
      lastName: 'User',
      isActive: true
    }
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create demo users for each role
  const demoUsers = await Promise.all([
    prisma.user.upsert({
      where: { email: 'editor@zohocrm.com' },
      update: {},
      create: {
        email: 'editor@zohocrm.com',
        username: 'editor_demo',
        password: await hashPassword('editor123!'),
        role: Role.EDITOR,
        firstName: 'Editor',
        lastName: 'User',
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'viewer@zohocrm.com' },
      update: {},
      create: {
        email: 'viewer@zohocrm.com',
        username: 'viewer_demo',
        password: await hashPassword('viewer123!'),
        role: Role.VIEWER,
        firstName: 'Viewer',
        lastName: 'User',
        isActive: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'partner@zohocrm.com' },
      update: {},
      create: {
        email: 'partner@zohocrm.com',
        username: 'partner_demo',
        password: await hashPassword('partner123!'),
        role: Role.PARTNER,
        firstName: 'Partner',
        lastName: 'User',
        isActive: true
      }
    })
  ])

  console.log('✅ Created demo users:', demoUsers.length)

  console.log('🎉 Database seeded successfully!')
  console.log('\n📝 Demo Credentials:')
  console.log('Admin: admin@zohocrm.com / admin123!')
  console.log('Editor: editor@zohocrm.com / editor123!')
  console.log('Viewer: viewer@zohocrm.com / viewer123!')
  console.log('Partner: partner@zohocrm.com / partner123!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })