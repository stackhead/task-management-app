"use client"
import { useState } from "react"
import { account } from "@/components/services/appwrite"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { FiSend, FiLoader, FiCheckCircle } from "react-icons/fi"

export default function OTPVerificationPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (!otp) {
      toast.error("Please enter the OTP")
      return
    }

    setIsLoading(true)

    try {
      await account.updateRecovery(otp)
      toast.success("OTP Verified! Redirecting to reset password...")
      setTimeout(() => {
        router.push("/auth/reset-password")
      }, 1000)
    } catch (error) {
      console.error(error)
      toast.error("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Toaster position="top-right" />
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Enter OTP</h1>
            <p className="text-gray-600 mt-2">Check your email and enter the OTP</p>
          </div>
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="otp" className="block text-md font-medium text-gray-900">OTP</label>
              <input
                id="otp"
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={isLoading}
                required
                className="w-full px-3 py-2 border border-gray-900 rounded-md shadow-sm placeholder-gray-400 text-black"
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2.5 px-4 text-white bg-gray-900 rounded-md shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? <FiLoader className="animate-spin h-4 w-4" /> : <FiCheckCircle className="w-4 h-4 mr-2" />}
              Verify OTP
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive OTP? <button onClick={() => toast.info("Resending OTP...")} className="text-gray-900 hover:underline">Resend</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
