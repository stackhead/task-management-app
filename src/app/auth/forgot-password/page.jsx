"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { FiMail, FiLoader, FiArrowLeft } from "react-icons/fi"
import { motion } from "framer-motion"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error("Please enter your email")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Sending OTP...")

    try {
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()

      // Store in localStorage temporarily (for demo purposes)
      localStorage.setItem("resetOTP", otp)
      localStorage.setItem("resetEmail", email)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.dismiss(loadingToast)
      toast.success("OTP sent to your email!")
      router.push("/auth/otp")
      
    } catch (error) {
      console.error("OTP sending failed:", error)
      toast.dismiss(loadingToast)
      toast.error(error.message || "Failed to send OTP")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            color: '#1a1a1a',
          },
        }}
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row"
      >
        {/* Illustration Section */}
        <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-8 hidden md:flex flex-col justify-center">
          <div className="space-y-4 text-white">
            <h2 className="text-3xl font-bold">Reset Your Password</h2>
            <p className="opacity-90">Enter your email to receive a verification code</p>
          </div>
          <div className="mt-8 relative h-64">
            <div className="absolute inset-0 bg-[url('/images/auth-illustration.svg')] bg-contain bg-no-repeat bg-center opacity-20" />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 sm:p-10">
          <button 
            onClick={() => router.back()}
            className="flex items-center cursor-pointer text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
            <p className="text-gray-600">We'll send a verification code to your email</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full cursor-pointer flex justify-center items-center py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all relative overflow-hidden disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <FiMail className="mr-2" />
                  Send Verification Code
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Remember your password?{" "}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}