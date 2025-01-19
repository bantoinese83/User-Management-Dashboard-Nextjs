import { ReactNode } from 'react'
import {Header} from "@/src/components/layout/Header";
import {Footer} from "@/src/components/layout/Footer";

interface LayoutProps {
  children: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4 bg-white shadow-md rounded-lg">{children}</main>
      <Footer />
    </div>
  )
}
