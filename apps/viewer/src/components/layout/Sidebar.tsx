import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Camera, 
  Settings, 
  Target, 
  Video, 
  Wrench,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useAuthStore } from '@stores/authStore'
import { cn } from '@utils/cn'

interface NavItem {
  path: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const navItems: NavItem[] = [
  {
    path: '/',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'System overview and status'
  },
  {
    path: '/site-config',
    label: 'Site Configuration',
    icon: Camera,
    description: 'Camera setup and management'
  },
  {
    path: '/calibration',
    label: 'Calibration',
    icon: Wrench,
    description: 'Camera calibration tools'
  },
  {
    path: '/operations',
    label: 'Operations',
    icon: Video,
    description: 'Live camera feeds and monitoring'
  },
  {
    path: '/tracking',
    label: 'Tracking',
    icon: Target,
    description: 'Object tracking and PTZ control'
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    description: 'System configuration'
  }
]

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const location = useLocation()
  const { user } = useAuthStore()

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-secondary-200 dark:border-secondary-700">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🚁</span>
            </div>
            <div>
              <h1 className="font-bold text-secondary-900 dark:text-white">DroneVoxel</h1>
              <p className="text-xs text-secondary-500 dark:text-secondary-400">Server</p>
            </div>
          </motion.div>
        )}
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-secondary-600 dark:text-secondary-400" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 group',
                  'hover:bg-secondary-100 dark:hover:bg-secondary-700',
                  isActive && 'bg-primary-50 dark:bg-primary-900/20 border-r-2 border-primary-600'
                )
              }
              title={isCollapsed ? item.description : undefined}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 transition-colors',
                  location.pathname === item.path
                    ? 'text-primary-600'
                    : 'text-secondary-600 dark:text-secondary-400 group-hover:text-secondary-900 dark:group-hover:text-white'
                )} 
              />
              
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex-1"
                >
                  <span className={cn(
                    'font-medium transition-colors',
                    location.pathname === item.path
                      ? 'text-primary-600'
                      : 'text-secondary-900 dark:text-white group-hover:text-secondary-900 dark:group-hover:text-white'
                  )}>
                    {item.label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User Info */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 border-t border-secondary-200 dark:border-secondary-700"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
              <span className="text-primary-600 dark:text-primary-400 font-medium text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 dark:text-white truncate">
                {user?.username || 'User'}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-400 capitalize">
                {user?.role || 'viewer'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
