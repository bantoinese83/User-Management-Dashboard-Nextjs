import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getUser, updateUser } from '@/src/features/users/services/userService'
import { User } from '@/src/types/user'

const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['USER', 'ADMIN']),
})

type UserFormData = z.infer<typeof userSchema>

export default function EditUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const { id } = router.query

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  })

  useEffect(() => {
    const fetchUser = async () => {
      if (typeof id !== 'string') return
      try {
        const fetchedUser = await getUser(id)
        setUser(fetchedUser)
        setValue('name', fetchedUser.name)
        setValue('email', fetchedUser.email)
        setValue('role', fetchedUser.role)
      } catch (error) {
        setError('Failed to fetch user')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id, setValue])

  const onSubmit = async (data: UserFormData) => {
    if (typeof id !== 'string') return
    try {
      await updateUser(id, data)
      router.push('/dashboard')
    } catch (error) {
      setError('Failed to update user')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!user) return <div>User not found</div>

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1">Name</label>
          <input
            id="name"
            {...register('name')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block mb-1">Email</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            className="w-full px-3 py-2 border rounded"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="role" className="block mb-1">Role</label>
          <select
            id="role"
            {...register('role')}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Update User
        </button>
      </form>
    </div>
  )
}

