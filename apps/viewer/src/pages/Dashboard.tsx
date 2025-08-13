import React from 'react'
import { motion } from 'framer-motion'
import { 
  Camera, 
  Target, 
  AlertTriangle, 
  Activity, 
  Shield, 
  TrendingUp,
  Clock,
  MapPin,
  Wrench
} from 'lucide-react'
import { cn } from '@utils/cn'

interface StatCard {
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ComponentType<{ className?: string }>
  description: string
}

interface RecentActivity {
  id: string
  type: 'detection' | 'alert' | 'calibration' | 'system'
  message: string
  time: string
  severity: 'low' | 'medium' | 'high'
}

const stats: StatCard[] = [
  {
    title: 'Active Cameras',
    value: 8,
    change: '+2',
    changeType: 'positive',
    icon: Camera,
    description: 'Cameras currently streaming'
  },
  {
    title: 'Objects Tracked',
    value: 12,
    change: '+3',
    changeType: 'positive',
    icon: Target,
    description: 'Active object tracks'
  },
  {
    title: 'System Health',
    value: '98%',
    change: '+2%',
    changeType: 'positive',
    icon: Shield,
    description: 'Overall system health'
  },
  {
    title: 'Detection Rate',
    value: '94%',
    change: '-1%',
    changeType: 'negative',
    icon: TrendingUp,
    description: 'Object detection accuracy'
  }
]

const recentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'detection',
    message: 'New drone detected in Zone A',
    time: '2 minutes ago',
    severity: 'medium'
  },
  {
    id: '2',
    type: 'calibration',
    message: 'Camera 3 calibration completed',
    time: '5 minutes ago',
    severity: 'low'
  },
  {
    id: '3',
    type: 'alert',
    message: 'Unauthorized access attempt detected',
    time: '12 minutes ago',
    severity: 'high'
  },
  {
    id: '4',
    type: 'system',
    message: 'System backup completed successfully',
    time: '1 hour ago',
    severity: 'low'
  }
]

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            System overview and real-time status
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm text-secondary-500 dark:text-secondary-400">
          <Clock className="w-4 h-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
                <stat.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div className={cn(
                'text-sm font-medium',
                stat.changeType === 'positive' && 'text-success-600 dark:text-success-400',
                stat.changeType === 'negative' && 'text-danger-600 dark:text-danger-400',
                stat.changeType === 'neutral' && 'text-secondary-600 dark:text-secondary-400'
              )}>
                {stat.change}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
                {stat.value}
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-400 mt-1">
                {stat.title}
              </p>
              <p className="text-xs text-secondary-500 dark:text-secondary-500 mt-2">
                {stat.description}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-secondary-900 dark:text-white">
              System Status
            </h2>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success-500 rounded-full"></div>
              <span className="text-sm text-secondary-600 dark:text-secondary-400">
                All systems operational
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Camera className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900 dark:text-white">Camera System</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900 dark:text-white">Tracking Engine</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Active</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-secondary-50 dark:bg-secondary-700/50 rounded-lg">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-secondary-900 dark:text-white">Security System</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                <span className="text-sm text-secondary-600 dark:text-secondary-400">Protected</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-sm"
        >
          <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
            Recent Activity
          </h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors"
              >
                <div className={cn(
                  'w-2 h-2 rounded-full mt-2',
                  activity.severity === 'high' && 'bg-danger-500',
                  activity.severity === 'medium' && 'bg-warning-500',
                  activity.severity === 'low' && 'bg-success-500'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-secondary-900 dark:text-white font-medium">
                    {activity.message}
                  </p>
                  <p className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
            View all activity
          </button>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-6 shadow-sm"
      >
        <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
            <Camera className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-white">Add Camera</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
            <Wrench className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-white">Calibrate</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
            <MapPin className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-white">Define Zones</span>
          </button>
          
          <button className="flex flex-col items-center p-4 rounded-lg border border-secondary-200 dark:border-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-700/50 transition-colors">
            <AlertTriangle className="w-8 h-8 text-primary-600 mb-2" />
            <span className="text-sm font-medium text-secondary-900 dark:text-white">Set Alerts</span>
          </button>
        </div>
      </motion.div>
    </div>
  )
}
