import { Server } from 'socket.io'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export function initializeSocketServer(server: any) {
  const io = new Server(server)

  io.on('connection', (socket) => {
    console.log('A user connected')

    socket.on('user_status', async ({ userId, status }) => {
      await prisma.userStatus.upsert({
        where: { userId },
        update: { status, lastSeen: new Date() },
        create: { userId, status }
      })
      io.emit('user_status_update', { userId, status })
    })

    socket.on('disconnect', () => {
      console.log('A user disconnected')
    })
  })

  return io
}
