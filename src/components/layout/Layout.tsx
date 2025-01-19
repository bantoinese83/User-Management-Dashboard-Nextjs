import { ReactNode } from 'react'
import {Header} from "@/src/components/layout/Header";
import {Footer} from "@/src/components/layout/Footer";
import { AuthProvider } from "@/src/hooks/useAuth";

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">{children}</main>
        <Footer />
      </div>
    </AuthProvider>
  )
}
