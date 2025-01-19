import { NextApiRequest, NextApiResponse } from 'next'
import { getCurrentUser } from '@/src/features/auth/services/authService'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const token = req.cookies.token

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const user = await getCurrentUser(token)

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } })
  } catch (error) {
    console.error('Get current user error:', error)
    res.status(401).json({ message: 'Invalid token' })
  }
}
