import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const getBadges = async () => {
  return prisma.badge.findMany()
}

export const createBadge = async (name: string, description: string, imageUrl: string) => {
  return prisma.badge.create({
    data: { name, description, imageUrl }
  })
}

export const assignBadgeToUser = async (userId: string, badgeId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } })

  if (!user || !badge) {
    throw new AppError('User or badge not found', 404)
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      badges: {
        connect: { id: badgeId }
      }
    }
  })
}

