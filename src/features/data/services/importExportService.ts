import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export const importUsers = async (userData: any[]) => {
  const importedUsers = []

  for (const user of userData) {
    const existingUser = await prisma.user.findUnique({ where: { email: user.email } })
    if (existingUser) {
      throw new AppError(`User with email ${user.email} already exists`, 400)
    }

    const hashedPassword = await bcrypt.hash(user.password, 10)
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    })
    importedUsers.push(newUser)
  }

  return importedUsers
}

export const exportUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLogin: true,
      isActive: true,
    },
  })

  return users
}

export const backupData = async () => {
  // In a real application, you would implement a more comprehensive backup strategy
  // This is a simplified example
  const users = await prisma.user.findMany()
  const loginAttempts = await prisma.loginAttempt.findMany()
  const userActivities = await prisma.userActivity.findMany()

  return {
    users,
    loginAttempts,
    userActivities,
  }
}

export const restoreData = async (backupData: any) => {
  // In a real application, you would implement proper validation and error handling
  // This is a simplified example
  await prisma.user.deleteMany()
  await prisma.loginAttempt.deleteMany()
  await prisma.userActivity.deleteMany()

  await prisma.user.createMany({ data: backupData.users })
  await prisma.loginAttempt.createMany({ data: backupData.loginAttempts })
  await prisma.userActivity.createMany({ data: backupData.userActivities })

  return { message: 'Data restored successfully' }
}

