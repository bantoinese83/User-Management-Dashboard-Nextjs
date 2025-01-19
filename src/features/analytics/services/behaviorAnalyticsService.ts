import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function logUserBehavior(userId: string, action: string, metadata?: Record<string, unknown>) {
  await prisma.behaviorLog.create({
    data: {
      userId,
      action,
      metadata,
    },
  })
}

export async function detectUnusualPatterns(userId: string) {
  const recentLogs = await prisma.behaviorLog.findMany({
    where: {
      userId,
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  })

  const failedLogins = recentLogs.filter((log) => log.action === 'failed_login').length

  if (failedLogins >= 5) {
    return {
      unusual: true,
      reason: 'Multiple failed login attempts',
    }
  }

  return { unusual: false }
}

export async function predictChurn(userId: string) {
  // This is a simplified example. In a real-world scenario, you'd use more sophisticated ML models.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { usageStats: true },
  })

  if (!user || !user.usageStats) {
    return { churnRisk: 'unknown' }
  }

  const daysSinceLastLogin = Math.floor((Date.now() - user.lastLogin.getTime()) / (1000 * 60 * 60 * 24))

  if (daysSinceLastLogin > 30) {
    return { churnRisk: 'high' }
  } else if (daysSinceLastLogin > 14) {
    return { churnRisk: 'medium' }
  } else {
    return { churnRisk: 'low' }
  }
}
