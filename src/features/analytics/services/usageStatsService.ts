import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const updateUsageStats = async (userId: string, timeSpent: number, feature: string) => {
  const userStats = await prisma.usageStats.findUnique({ where: { userId } })

  if (!userStats) {
    return prisma.usageStats.create({
      data: {
        userId,
        timeSpent,
        featureUsage: { [feature]: 1 }
      }
    })
  }

  const updatedFeatureUsage = {
    ...userStats.featureUsage,
    [feature]: (userStats.featureUsage[feature] || 0) + 1
  }

  return prisma.usageStats.update({
    where: { userId },
    data: {
      timeSpent: userStats.timeSpent + timeSpent,
      featureUsage: updatedFeatureUsage
    }
  })
}

export const getUserStats = async (userId: string) => {
  const stats = await prisma.usageStats.findUnique({ where: { userId } })

  if (!stats) {
    throw new AppError('Usage stats not found', 404)
  }

  return stats
}

