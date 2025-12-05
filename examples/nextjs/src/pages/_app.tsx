import '@/styles/globals.css'
import 'react-toastify/dist/ReactToastify.css'

import { AuthChangeRedirector } from '@octue/allauth-js/nextjs'
import { AuthContextProvider } from '@octue/allauth-js/react'
// If you're not using Tailwind CSS, uncomment the following line to import
// the pre-compiled styles for allauth-js components:
// import '@octue/allauth-js/styles.css'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider
      urls={{
        loginRedirect: '/account/settings',
        logoutRedirect: '/',
        login: '/account/login',
      }}
    >
      <AuthChangeRedirector>
        <Component {...pageProps} />
      </AuthChangeRedirector>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthContextProvider>
  )
}
