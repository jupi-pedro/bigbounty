const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const VALID_ROLES = ['Administrator', 'Moderator', 'Developer', 'Viewer']

async function createAdmin() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    console.error('Usage: npm run create-admin <email> <password> [name] [role]')
    console.error('Example: npm run create-admin admin@example.com mypassword123 "Admin User" Administrator')
    console.error(`\nValid roles: ${VALID_ROLES.join(', ')}`)
    process.exit(1)
  }

  const [email, password, name = 'User', role = 'Administrator'] = args

  if (password.length < 6) {
    console.error('Error: Password must be at least 6 characters')
    process.exit(1)
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(`Error: Invalid role "${role}"`)
    console.error(`Valid roles: ${VALID_ROLES.join(', ')}`)
    process.exit(1)
  }

  const prisma = new PrismaClient()

  try {
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      console.error(`Error: User with email "${email}" already exists`)
      process.exit(1)
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    })

    console.log('Admin user created successfully!')
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Role: ${user.role}`)
  } catch (error) {
    console.error('Failed to create admin user:', error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()
