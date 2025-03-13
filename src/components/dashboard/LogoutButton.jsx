"use client"
import { useState } from "react"
import { account } from "@/components/services/appwrite"
import { useRouter } from "next/navigation"
import { FiLogOut } from "react-icons/fi"
import { toast } from "react-hot-toast"

export default function LogoutButton() {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  
  const handleLogout = async () => {
    try {
     
      await account.deleteSession("current")
      
      // Show success toast
      toast.success("Logged out successfully")
      
      // Delay redirect by 500ms
      setTimeout(() => {
        router.push("/auth/login")
      }, 500)
    } catch (error) {
      console.error("Logout failed:", error)
      toast.error("Logout failed. Please try again.")
    } finally {
      setShowModal(false)
    }
  }
  
  return (
    <>
      <button
        onClick={handleLogout}
        className="flex items-center px-3 py-2 text-sm justify-center text-white  transition-all duration-200 border border-red-400 bg-red-600/40 shadow rounded-md hover:bg-red-600 "
      >
        <FiLogOut className="mr-1" size={16} />
        Logout
      </button>
{/*       
      Confirmation Modal
      {showModal && (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg text-gray-300 font-medium mb-4">Confirm Logout</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to log out?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-300 border rounded-md hover:bg-gray-700 transition-all duration-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-white bg-red-600/50 rounded-md hover:bg-red-600 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )} */}
    </>
  )
}