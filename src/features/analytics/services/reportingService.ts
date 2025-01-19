import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const getUserDemographics = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      lastLogin: true,
    }
  })

  const totalUsers = users.length
  const roleDistribution = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  const activeUsers = users.filter(user => user.lastLogin && new Date(user.lastLogin) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length

  return {
    totalUsers,
    roleDistribution,
    activeUsers,
  }
}

export const getLoginTrends = async (startDate: Date, endDate: Date) => {
  const loginAttempts = await prisma.loginAttempt.findMany({
    where: {
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      success: true,
      timestamp: true,
    },
  })

  const successfulLogins = loginAttempts.filter(attempt => attempt.success).length
  const failedLogins = loginAttempts.filter(attempt => !attempt.success).length

  return {
    successfulLogins,
    failedLogins,
    totalAttempts: loginAttempts.length,
  }
}

export const getRoleUsageStatistics = async () => {
  const users = await prisma.user.findMany({
    select: {
      role: true,
    }
  })

  const roleUsage = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1
    return acc
  }, {})

  return roleUsage
}

export const generateCSVReport = (data: any[]): string => {
  const headers = Object.keys(data[0]).join(',')
  const rows = data.map(item => Object.values(item).join(','))
  return [headers, ...rows].join('\n')
}

export const generatePDFReport = (data: any): string => {
  // In a real application, you would use a PDF generation library here
  // For this example, we'll return a simple string representation
  return JSON.stringify(data, null, 2)
}

