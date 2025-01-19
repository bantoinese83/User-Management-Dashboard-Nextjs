import { useState, useEffect } from 'react'
import { getUsers } from '../features/users/services/userService'
import { User } from '../types/user'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface UserStats {
  totalUsers: number
  adminUsers: number
  regularUsers: number
  usersByMonth: { name: string; Users: number }[]
}

export default function Analytics() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const users = await getUsers()
        const stats = calculateUserStats(users)
        setUserStats(stats)
      } catch (error) {
        console.error('Failed to fetch user statistics')
      } finally {
        setLoading(false)
      }
    }
    fetchUserStats()
  }, [])

  const calculateUserStats = (users: User[]): UserStats => {
    const totalUsers = users.length
    const adminUsers = users.filter(user => user.role === 'ADMIN').length
    const regularUsers = totalUsers - adminUsers

    const usersByMonth = users.reduce((acc, user) => {
      const month = new Date(user.createdAt).toLocaleString('default', { month: 'long' })
      const existingMonth = acc.find(item => item.name === month)
      if (existingMonth) {
        existingMonth.Users++
      } else {
        acc.push({ name: month, Users: 1 })
      }
      return acc
    }, [] as { name: string; Users: number }[])

    return { totalUsers, adminUsers, regularUsers, usersByMonth }
  }

  if (loading) return <div>Loading...</div>
  if (!userStats) return <div>No data available</div>

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-blue-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-3xl font-bold">{userStats.totalUsers}</p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Admin Users</h2>
          <p className="text-3xl font-bold">{userStats.adminUsers}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Regular Users</h2>
          <p className="text-3xl font-bold">{userStats.regularUsers}</p>
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">User Registrations by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={userStats.usersByMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Users" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
