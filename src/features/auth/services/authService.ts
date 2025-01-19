import { User } from '@/src/types/user'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const login = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401)
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    await prisma.user.update({
      where: { id: user.id },
      data: { failedLogins: user.failedLogins + 1 }
    })
    if (user.failedLogins + 1 >= 5) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isActive: false }
      })
      throw new AppError('Account locked due to too many failed attempts', 403)
    }
    throw new AppError('Invalid credentials', 401)
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date(), failedLogins: 0 }
  })

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' })

  return { user, token }
}

export const logout = async () => {
  // In a more advanced system, you might want to invalidate the token here
  // For now, we'll just rely on the client removing the token
}

export const getCurrentUser = async (token: string): Promise<User | null> => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string }
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } })
    return user
  } catch (error) {
    return null
  }
}

export const register = async (name: string, email: string, password: string): Promise<User> => {
  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    throw new AppError('User already exists', 400)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  return user
}

export const resetPassword = async (email: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new AppError('User not found', 404)
  }

  // In a real application, you would generate a reset token and send an email here
  // For this example, we'll just log a message
  console.log(`Password reset requested for ${email}`)
}

export const changePassword = async (userId: string, oldPassword: string, newPassword: string): Promise<void> => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw new AppError('User not found', 404)
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
  if (!isPasswordValid) {
    throw new AppError('Invalid old password', 401)
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword }
  })
}

