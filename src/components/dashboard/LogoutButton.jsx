"use client"

import { useState } from "react"
import { FiLogOut, FiLoader } from "react-icons/fi"
import { account } from "@/components/services/appwrite"
import { useRouter } from "next/navigation"

const LogoutButton = ({ isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await account.deleteSession("current")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center px-3 py-1.5 rounded-md ${
        isDarkMode ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      } transition-colors cursor-pointer`}
    >
      {isLoading ? <FiLoader className="animate-spin mr-1" size={16} /> : <FiLogOut className="mr-1" size={16} />}
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  )
}

export default LogoutButton

