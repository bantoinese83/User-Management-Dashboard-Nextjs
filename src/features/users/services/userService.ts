import { User } from '@/src/types/user'
import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const getUsers = async (page: number = 1, limit: number = 10): Promise<{ users: User[], pagination: { page: number, limit: number, total: number, pages: number } }> => {
  const skip = (page - 1) * limit
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: { id: true, name: true, email: true, role: true, createdAt: true, lastLogin: true, isActive: true }
    }),
    prisma.user.count()
  ])

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

export const getUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw new AppError('User not found', 404)
  }
  return user
}

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
  const existingUser = await prisma.user.findUnique({ where: { email: userData.email } })
  if (existingUser) {
    throw new AppError('User with this email already exists', 400)
  }

  const user = await prisma.user.create({ data: userData })
  return user
}

export const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
  const user = await prisma.user.update({
    where: { id },
    data: userData
  })
  return user
}

export const deleteUser = async (id: string): Promise<void> => {
  await prisma.user.delete({ where: { id } })
}

export const deactivateUser = async (id: string): Promise<User> => {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: false }
  })
  return user
}

export const activateUser = async (id: string): Promise<User> => {
  const user = await prisma.user.update({
    where: { id },
    data: { isActive: true, failedLogins: 0 }
  })
  return user
}

export const getUserActivity = async (userId: string, page: number = 1, limit: number = 10): Promise<{ activities: { id: string, action: string, timestamp: Date }[], pagination: { page: number, limit: number, total: number, pages: number } }> => {
  // In a real application, you would have a separate table for user activity
  // For this example, we'll just return some mock data
  return {
    activities: [
      { id: '1', action: 'Login', timestamp: new Date() },
      { id: '2', action: 'Update Profile', timestamp: new Date() },
    ],
    pagination: {
      page,
      limit,
      total: 2,
      pages: 1
    }
  }
}
