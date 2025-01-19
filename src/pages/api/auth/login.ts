import { NextApiRequest, NextApiResponse } from 'next'
import { login } from '@/src/features/auth/services/authService'
import { initializeSocketServer } from '@/src/server/socketServer'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { email, password } = req.body

  try {
    const { user, token } = await login(email, password)

    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`)

    // Update user status
    await prisma.userStatus.upsert({
      where: { userId: user.id },
      update: { status: 'online', lastSeen: new Date() },
      create: { userId: user.id, status: 'online' }
    })

    // Emit real-time status update
    const io = initializeSocketServer(res.socket.server)
    io.emit('user_status_update', { userId: user.id, status: 'online' })

    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Internal server error' })
  }
}
