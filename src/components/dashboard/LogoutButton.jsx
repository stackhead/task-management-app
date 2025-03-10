"use client"

import { account } from "@/components/services/appwrite"
import { useRouter } from "next/navigation"
import { FiLogOut } from "react-icons/fi"

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await account.deleteSession("current")
      router.push("/auth/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center px-3 py-2 text-sm text-gray-300 bg-gray-800 rounded-md hover:bg-gray-700"
    >
      <FiLogOut className="mr-1" size={16} />
      Logout
    </button>
  )
}

