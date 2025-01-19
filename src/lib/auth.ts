import jwt from 'jsonwebtoken'
import { User } from '../types/user'

export const verifyToken = (token: string): User => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as User
  } catch {
    throw new Error('Invalid token')
  }
}
