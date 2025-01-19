import Link from 'next/link'
import { useAuth, AuthProvider } from "@/src/hooks/useAuth"
import { useRealTime } from "@/src/hooks/useRealTime"

interface OnlineUsers {
  [key: string]: string
}

const HeaderComponent = () => {
  const { user, logout } = useAuth()
  const { onlineUsers } = useRealTime() as { onlineUsers: OnlineUsers }

  return (
    <header className="bg-gray-800 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold hover:text-gray-300 transition duration-300 ease-in-out">
          User Management Dashboard
        </Link>
        <nav>
          {user ? (
            <>
              <Link href="/dashboard" className="mr-4 hover:text-gray-300 transition duration-300 ease-in-out">
                Dashboard
              </Link>
              <Link href="/profile" className="mr-4 hover:text-gray-300 transition duration-300 ease-in-out">
                Profile
              </Link>
              <Link href="/forum" className="mr-4 hover:text-gray-300 transition duration-300 ease-in-out">
                Forum
              </Link>
              {user.role === 'ADMIN' && (
                <>
                  <Link href="/analytics" className="mr-4 hover:text-gray-300 transition duration-300 ease-in-out">
                    Analytics
                  </Link>
                  <Link href="/data-management" className="mr-4 hover:text-gray-300 transition duration-300 ease-in-out">
                    Data Management
                  </Link>
                </>
              )}
              <span className="mr-4">
                Status: {onlineUsers[user.id] === 'online' ? 'Online' : 'Offline'}
              </span>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-300 ease-in-out">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="mr-4 hover:text-gray-300 transition duration-300 ease-in-out">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition duration-300 ease-in-out">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export const Header = () => (
  <AuthProvider>
    <HeaderComponent />
  </AuthProvider>
)