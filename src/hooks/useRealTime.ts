import { useEffect, useState } from 'react'
import io from 'socket.io-client'

export function useRealTime() {
  const [socket, setSocket] = useState(null)
  const [onlineUsers, setOnlineUsers] = useState({})

  useEffect(() => {
    const newSocket = io()
    setSocket(newSocket)

    newSocket.on('user_status_update', ({ userId, status }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: status }))
    })

    return () => {
      newSocket.disconnect()
    }
  }, [])

  const updateUserStatus = (userId: string, status: string) => {
    socket?.emit('user_status', { userId, status })
  }

  return { onlineUsers, updateUserStatus }
}

