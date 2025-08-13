import React from 'react'
import { motion } from 'framer-motion'
import { Wrench } from 'lucide-react'

export default function Calibration() {
  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-white">
            Camera Calibration
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Calibrate camera positions and orientations
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 p-8 text-center"
      >
        <Wrench className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary-900 dark:text-white mb-2">
          Calibration Tools
        </h3>
        <p className="text-secondary-600 dark:text-secondary-400 mb-6">
          Visual calibration tools for camera alignment and position refinement
        </p>
        <p className="text-sm text-secondary-500 dark:text-secondary-500">
          Coming soon - Advanced calibration interface with 3D visualization
        </p>
      </motion.div>
    </div>
  )
}
