import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const getAchievements = async () => {
  return prisma.achievement.findMany()
}

export const createAchievement = async (name: string, description: string, points: number) => {
  return prisma.achievement.create({
    data: { name, description, points }
  })
}

export const awardAchievementToUser = async (userId: string, achievementId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  const achievement = await prisma.achievement.findUnique({ where: { id: achievementId } })

  if (!user || !achievement) {
    throw new AppError('User or achievement not found', 404)
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      achievements: {
        connect: { id: achievementId }
      },
      points: {
        increment: achievement.points
      }
    }
  })
}

