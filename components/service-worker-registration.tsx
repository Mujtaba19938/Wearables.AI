"use client"

import { useEffect, useState } from "react"

export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            console.log("ServiceWorker registration successful with scope: ", reg.scope)
            setRegistration(reg)

            // Check if there's an update available
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing
              if (newWorker) {
                newWorker.addEventListener("statechange", () => {
                  if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    setUpdateAvailable(true)
                  }
                })
              }
            })
          })
          .catch((error) => {
            console.log("ServiceWorker registration failed: ", error)
          })

        // Handle updates from other tabs
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (document.visibilityState === "visible") {
            window.location.reload()
          }
        })
      })
    }
  }, [])

  const updateServiceWorker = () => {
    if (registration && registration.waiting) {
      // Send message to service worker to skip waiting and activate new version
      registration.waiting.postMessage({ type: "SKIP_WAITING" })
      setUpdateAvailable(false)
    }
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#0f1117] border border-[#1a1c25] px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
      <span>Update available!</span>
      <button
        onClick={updateServiceWorker}
        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-3 py-1 rounded text-sm"
      >
        Refresh
      </button>
    </div>
  )
}
