import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AuthProvider } from '../features/auth/hooks/useAuth'
import { Layout } from '../components/layout/Layout'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}

export default MyApp

