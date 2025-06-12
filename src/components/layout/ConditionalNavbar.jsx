"use client"

import { usePathname } from "next/navigation"
import Navbar from "@/components/dashboard/Navbar"
import { useEffect, useState } from "react"
import { account } from "@/lib/appwrite"

const ConditionalNavbar = () => {
  const pathname = usePathname()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Pages where navbar should NOT be shown
  const excludedPaths = [
    "/login",
    "/signup",
    "/register",
    "/auth",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/", // Landing page
  ]

  // Check if current path should show navbar
  const shouldShowNavbar = !excludedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"))

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get()
        setUser(currentUser)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    if (shouldShowNavbar) {
      checkUser()
    } else {
      setLoading(false)
    }
  }, [shouldShowNavbar])

  // Don't render navbar on excluded pages
  if (!shouldShowNavbar) {
    return null
  }

  // Don't render navbar if still loading user data
  if (loading) {
    return null
  }

  // Don't render navbar if no user is authenticated
  if (!user) {
    return null
  }

  return <Navbar user={user} isDarkMode={false} />
}

export default ConditionalNavbar
