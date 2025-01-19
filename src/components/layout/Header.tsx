import Link from 'next/link'
import {useAuth} from "@/src/hooks/useAuth";
import {useRealTime} from "@/src/hooks/useRealTime";


export const Header = () => {
  const { user, logout } = useAuth()
  const { onlineUsers } = useRealTime()

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          User Management Dashboard
        </Link>
        <nav>
          {user ? (
            <>
              <Link href="/dashboard" className="mr-4">
                Dashboard
              </Link>
              <Link href="/profile" className="mr-4">
                Profile
              </Link>
              <Link href="/forum" className="mr-4">
                Forum
              </Link>
              {user.role === 'ADMIN' && (
                <>
                  <Link href="/analytics" className="mr-4">
                    Analytics
                  </Link>
                  <Link href="/data-management" className="mr-4">
                    Data Management
                  </Link>
                </>
              )}
              <span className="mr-4">
                Status: {onlineUsers[user.id] === 'online' ? 'Online' : 'Offline'}
              </span>
              <button onClick={logout} className="bg-red-500 px-4 py-2 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="mr-4">
                Login
              </Link>
              <Link href="/auth/signup" className="bg-blue-500 px-4 py-2 rounded">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

