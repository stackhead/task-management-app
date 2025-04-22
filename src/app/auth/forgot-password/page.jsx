"use client"

import { useState } from "react"
import { Client, Account } from "appwrite"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from 'next/image'
import toast, { Toaster } from "react-hot-toast"
import { FiMail, FiLoader, FiArrowLeft } from "react-icons/fi"
import { MdOutlineSendToMobile } from "react-icons/md";
;

import { motion } from "framer-motion"

// Initialize Appwrite
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

const account = new Account(client)

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

  // Replace the existing try block with:
try {
  const resetUrl = `${window.location.origin}/auth/reset-password?userId={userId}&secret={secret}&expire={expire}`
  await account.createRecovery(email, resetUrl)

  toast.success("Password reset link sent to your email! Check your inbox.", {
    duration: 4000
  });

  // Wait before redirecting
  await new Promise(resolve => setTimeout(resolve, 2000));
} catch (error) {

      // Specific error handling
      if (error.type === "user_invalid_credentials") {
        toast.error("Email not registered")
      } else if (error.message.includes("SMTP")) {
        toast.error("Email service not configured")
      } else {
        toast.error(error.message || "Failed to send reset link")
      }
    } finally {
      setIsLoading(false)
    }
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col ">
          <div className="flex flex-row justify-between items-center px-4">
            <Image
              src={"/svgs/logo.svg"}
              alt="Logo"
              width={200}
              height={200}
            />
            <div className="flex flex-row items-center  space-x-2"> {/* Added justify-center */}
              <div className="text-gray-900">Remember your password?</div>
              <Link href="/auth/login">
                <button className="text-white py-2 px-4 font-medium text-[16px] rounded-xl drop-shadow-2xl cursor-pointer shadow-indigo-800 bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  Sign in
                </button>
              </Link>
            </div>
          </div>
    <div className=" bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            color: "#1a1a1a",
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
            <p className="opacity-90">We'll send a reset link to your registered email</p>
          </div>
          <div className="mt-12 relative h-96">
            <div className="absolute inset-0 bg-[url('/images/auth-illustration.svg')] bg-contain bg-no-repeat bg-center opacity-20" />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-12 sm:p-16">
          <Link
            href="/auth/login"
            className="flex items-center text-gray-600 hover:text-indigo-600 mb-10 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back to Login
          </Link>

          <div className="text-center mb-16">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Forgot Password?</h1>
            <p className="text-gray-600">Enter your registered email to receive reset link</p>
          </div>

          <form onSubmit={handleForgotPassword} className="space-y-8">
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-black pl-10 pr-4 py-4 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center cursor-pointer items-center py-4 px-6 rounded-lg bg-indigo-600 text-white font-medium transition-all hover:bg-indigo-700 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin mr-2" />
                  Sending link...
                </>
              ) : (
                <>
                                    <MdOutlineSendToMobile className="mr-2" />
                                    Send reset link
                                  </>
              )}
            </button>
          </form>

          <div className="mt-16 text-center text-sm text-gray-600">
            Need help ?  Contact our{" "}
            <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
             support team
            </Link>
           <br/>we are available 24/7  
          </div>
        </div>
      </motion.div>
    </div>
    </div>
  )
}