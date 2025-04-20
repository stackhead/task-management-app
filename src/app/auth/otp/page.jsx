"use client"

import { useState } from "react"
import { account } from "@/components/services/appwrite"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { FiSend, FiLoader, FiCheckCircle, FiArrowLeft } from "react-icons/fi"
import { motion } from "framer-motion"

export default function OTPVerificationPage() {
  const router = useRouter()
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()

    if (!otp) {
      toast.error("Please enter the OTP")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Verifying OTP...")

    try {
      await account.updateRecovery(otp)
      toast.dismiss(loadingToast)
      toast.success("OTP Verified! Redirecting...")
      setTimeout(() => {
        router.push("/auth/reset-password")
      }, 1000)
    } catch (error) {
      console.error(error)
      toast.dismiss(loadingToast)
      toast.error("Invalid OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = () => {
    toast.promise(
      new Promise((resolve) => {
        // Simulate OTP resend
        setTimeout(() => resolve("OTP resent successfully!"), 1500)
      }),
      {
        loading: "Resending OTP...",
        success: (message) => message,
        error: "Failed to resend OTP"
      }
    )
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
            <h2 className="text-3xl font-bold">Verify Your Identity</h2>
            <p className="opacity-90">Enter the verification code sent to your email</p>
          </div>
          <div className="mt-8 relative h-64">
            <div className="absolute inset-0 bg-[url('/images/auth-illustration.svg')] bg-contain bg-no-repeat bg-center opacity-20" />
          </div>
        </div>

        {/* Form Section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="md:w-1/2 p-8 sm:p-10"
        >
          <button 
            onClick={() => router.back()}
            className="flex cursor-pointer items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter Verification Code</h1>
            <p className="text-gray-600">We've sent a 6-digit code to your email</p>
          </div>

          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="relative group">
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    setOtp(value)
                  }}
                  disabled={isLoading}
                  required
                  className="w-full text-black px-4 py-3 text-center text-xl tracking-widest rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className={`w-full flex justify-center items-center cursor-pointer py-3.5 px-6 rounded-lg bg-indigo-600 text-white font-medium transition-all relative overflow-hidden ${
                  isLoading ? 'opacity-75' : 'hover:bg-indigo-700'
                } ${otp.length !== 6 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2" />
                    Verify Code
                  </>
                )}
                {isLoading && (
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-600">
            Didn't receive a code?{" "}
            <button 
              onClick={handleResendOTP}
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Resend code
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}