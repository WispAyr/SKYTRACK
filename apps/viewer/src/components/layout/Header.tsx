import React from 'react'
import { motion } from 'framer-motion'
import { 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Monitor, 
  LogOut,
  User,
  Settings
} from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { useThemeStore } from '@stores/themeStore'
import { cn } from '@utils/cn'

export default function Header() {
  const { user, logout } = useAuthStore()
  const { theme, setTheme } = useThemeStore()
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [notifications] = React.useState([
    { id: 1, message: 'Camera 3 calibration completed', type: 'success', time: '2 min ago' },
    { id: 2, message: 'New drone detected in Zone A', type: 'warning', time: '5 min ago' },
    { id: 3, message: 'System backup completed', type: 'info', time: '1 hour ago' },
  ])

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
  }

  return (
    <header className="bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
            <input
              type="text"
              placeholder="Search cameras, zones, or settings..."
              className="w-full pl-10 pr-4 py-2 bg-secondary-50 dark:bg-secondary-700 border border-secondary-200 dark:border-secondary-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <div className="flex items-center bg-secondary-100 dark:bg-secondary-700 rounded-lg p-1">
            <button
              onClick={() => setTheme('light')}
              className={cn(
                'p-2 rounded-md transition-colors',
                theme === 'light' && 'bg-white dark:bg-secondary-600 shadow-sm'
              )}
            >
              <Sun className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={cn(
                'p-2 rounded-md transition-colors',
                theme === 'dark' && 'bg-white dark:bg-secondary-600 shadow-sm'
              )}
            >
              <Moon className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={cn(
                'p-2 rounded-md transition-colors',
                theme === 'system' && 'bg-white dark:bg-secondary-600 shadow-sm'
              )}
            >
              <Monitor className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors relative">
              <Bell className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-secondary-900 dark:text-white">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                  {user?.role || 'viewer'}
                </p>
              </div>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-secondary-800 rounded-lg shadow-lg border border-secondary-200 dark:border-secondary-700 py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-secondary-200 dark:border-secondary-700">
                  <p className="text-sm font-medium text-secondary-900 dark:text-white">
                    {user?.username || 'User'}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400">
                    {user?.email || 'user@example.com'}
                  </p>
                </div>
                
                <div className="py-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-secondary-700 dark:text-secondary-300 hover:bg-secondary-50 dark:hover:bg-secondary-700 transition-colors">
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>
                
                <div className="border-t border-secondary-200 dark:border-secondary-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-danger-600 dark:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Panel (Hidden by default) */}
      <div className="hidden mt-4 p-4 bg-secondary-50 dark:bg-secondary-700 rounded-lg">
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-secondary-800 rounded-lg border border-secondary-200 dark:border-secondary-600"
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  notification.type === 'success' && 'bg-success-500',
                  notification.type === 'warning' && 'bg-warning-500',
                  notification.type === 'info' && 'bg-primary-500'
                )} />
                <span className="text-sm text-secondary-700 dark:text-secondary-300">
                  {notification.message}
                </span>
              </div>
              <span className="text-xs text-secondary-500 dark:text-secondary-400">
                {notification.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </header>
  )
}
