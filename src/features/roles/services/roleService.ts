import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const getRoles = async () => {
  return prisma.role.findMany()
}

export const createRole = async (name: string) => {
  const existingRole = await prisma.role.findUnique({ where: { name } })
  if (existingRole) {
    throw new AppError('Role already exists', 400)
  }

  return prisma.role.create({ data: { name } })
}

export const updateRole = async (id: string, name: string) => {
  return prisma.role.update({
    where: { id },
    data: { name }
  })
}

export const deleteRole = async (id: string) => {
  return prisma.role.delete({ where: { id } })
}

export const assignRoleToUser = async (userId: string, roleId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { role: roleId }
  })
}

