import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@keyllect.com' },
    update: {},
    create: {
      email: 'admin@keyllect.com',
      password: hashedPassword,
    },
  })
  
  console.log('Admin user created:', admin.email)

  // Add categories
  const categoriesData = [
    { name: 'Клавиатуры', slug: 'keyboards' },
    { name: 'Мыши', slug: 'mice' },
    { name: 'Коврики', slug: 'mousepads' },
    { name: 'Наушники', slug: 'headphones' },
  ]

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  
  console.log('Categories seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
