import React from 'react'
import { motion } from 'framer-motion'
import { Video } from 'lucide-react'

export default function Operations() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Operations
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Live camera feeds and real-time monitoring
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-8 text-center"
      >
        <Video className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
          Live Camera Feeds
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Multi-camera grid layout with real-time streaming and 3D voxel visualization
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-500">
          Coming soon - Advanced camera grid with PTZ controls and 3D scene view
        </p>
      </motion.div>
    </div>
  )
}
