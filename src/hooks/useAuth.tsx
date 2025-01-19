import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { useRouter } from 'next/router'

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const router = useRouter()

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch('/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        logout()
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      logout()
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      setToken(storedToken)
      fetchUser(storedToken)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      if (response.ok) {
        const { token } = await response.json()
        localStorage.setItem('token', token)
        setToken(token)
        await fetchUser(token)
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
