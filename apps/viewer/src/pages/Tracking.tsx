import React from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'

export default function Tracking() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Object Tracking
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Track objects, control PTZ cameras, and manage alerts
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-8 text-center"
      >
        <Target className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
          Tracking System
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Advanced object tracking with PTZ camera control and ATAK integration
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-500">
          Coming soon - Real-time tracking dashboard with alarm management
        </p>
      </motion.div>
    </div>
  )
}
