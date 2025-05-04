"use client"

import { Logo } from "./logo"
import { motion, AnimatePresence } from "framer-motion"

interface PreloaderProps {
  isVisible: boolean
}

export function Preloader({ isVisible }: PreloaderProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 17,
              delay: 0.1,
            }}
          >
            <Logo size="lg" />
          </motion.div>

          <motion.div
            className="mt-8 flex space-x-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                y: ["0%", "-50%", "0%"],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: 0,
              }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                y: ["0%", "-50%", "0%"],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: 0.15,
              }}
            />
            <motion.div
              className="h-2 w-2 rounded-full bg-primary"
              animate={{
                y: ["0%", "-50%", "0%"],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "loop",
                ease: "easeInOut",
                times: [0, 0.5, 1],
                delay: 0.3,
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
