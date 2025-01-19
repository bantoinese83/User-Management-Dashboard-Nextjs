import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

export async function createSegment(name: string, description: string, criteria: Prisma.JsonValue) {
  return prisma.userSegment.create({
    data: {
      name,
      description,
      criteria,
    },
  })
}

export async function getSegments() {
  return prisma.userSegment.findMany()
}

export async function assignUsersToSegment(segmentId: string) {
  const segment = await prisma.userSegment.findUnique({
    where: { id: segmentId },
  })

  if (!segment) {
    throw new Error('Segment not found')
  }

  const users = await prisma.user.findMany({
    where: segment.criteria as Prisma.UserWhereInput,
  })

  await prisma.userSegment.update({
    where: { id: segmentId },
    data: {
      users: {
        connect: users.map((user) => ({ id: user.id })),
      },
    },
  })

  return users
}