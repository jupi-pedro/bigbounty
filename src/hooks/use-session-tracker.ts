"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export function useSessionTracker() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Track session on mount and then every 5 minutes
      const trackSession = async () => {
        try {
          await fetch("/api/track-session", {
            method: "POST",
          })
        } catch (error) {
          console.error("Failed to track session:", error)
        }
      }

      // Track immediately
      trackSession()

      // Set up interval to track every 5 minutes
      const interval = setInterval(trackSession, 5 * 60 * 1000)

      return () => clearInterval(interval)
    }
  }, [session, status])
}