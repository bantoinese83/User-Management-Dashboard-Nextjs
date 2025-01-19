import { PrismaClient } from '@prisma/client'
import { AppError } from '@/src/lib/errorHandler'

const prisma = new PrismaClient()

export const getForumPosts = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit
  const [posts, total] = await Promise.all([
    prisma.forumPost.findMany({
      skip,
      take: limit,
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.forumPost.count()
  ])

  return {
    posts,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

export const createForumPost = async (userId: string, title: string, content: string) => {
  return prisma.forumPost.create({
    data: {
      title,
      content,
      author: { connect: { id: userId } }
    }
  })
}

export const getForumPost = async (id: string) => {
  const post = await prisma.forumPost.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } }
  })

  if (!post) {
    throw new AppError('Forum post not found', 404)
  }

  return post
}

export const updateForumPost = async (id: string, userId: string, title: string, content: string) => {
  const post = await prisma.forumPost.findUnique({ where: { id } })

  if (!post) {
    throw new AppError('Forum post not found', 404)
  }

  if (post.authorId !== userId) {
    throw new AppError('Not authorized to update this post', 403)
  }

  return prisma.forumPost.update({
    where: { id },
    data: { title, content }
  })
}

export const deleteForumPost = async (id: string, userId: string) => {
  const post = await prisma.forumPost.findUnique({ where: { id } })

  if (!post) {
    throw new AppError('Forum post not found', 404)
  }

  if (post.authorId !== userId) {
    throw new AppError('Not authorized to delete this post', 403)
  }

  return prisma.forumPost.delete({ where: { id } })
}

