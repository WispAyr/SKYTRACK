import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'

// Layout Components
import Layout from '@components/layout/Layout'
import Sidebar from '@components/layout/Sidebar'
import Header from '@components/layout/Header'

// Page Components
import Dashboard from '@pages/Dashboard'
import SiteConfiguration from '@pages/SiteConfiguration'
import Calibration from '@pages/Calibration'
import Operations from '@pages/Operations'
import Tracking from '@pages/Tracking'
import Settings from '@pages/Settings'

// Stores and Context
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'

// Styles
import './index.css'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

function App() {
  const { isAuthenticated } = useAuthStore()
  const { theme } = useThemeStore()

  // Apply theme to document
  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-secondary-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-primary-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-3xl">🚁</span>
              </div>
              <h1 className="text-2xl font-bold text-secondary-900 dark:text-white mb-2">
                DroneVoxelServer
              </h1>
              <p className="text-secondary-600 dark:text-secondary-300 mb-6">
                Sign in to access the drone detection system
              </p>
              <button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
                Sign In
              </button>
            </div>
          </motion.div>
        </div>
      </QueryClientProvider>
    )
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex h-screen bg-secondary-50 dark:bg-secondary-900 overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/site-config" element={<SiteConfiguration />} />
                  <Route path="/calibration" element={<Calibration />} />
                  <Route path="/operations" element={<Operations />} />
                  <Route path="/tracking" element={<Tracking />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </AnimatePresence>
            </main>
          </div>
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#1e293b' : '#ffffff',
              color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
              border: `1px solid ${theme === 'dark' ? '#334155' : '#e2e8f0'}`,
            },
          }}
        />
      </Router>
    </QueryClientProvider>
  )
}

export default App
