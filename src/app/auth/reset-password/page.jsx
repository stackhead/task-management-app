"use client"
import { useState, useEffect, useMemo } from "react"
import { account } from "@/components/services/appwrite"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { FiLock, FiLoader, FiCheckCircle, FiEye, FiEyeOff, FiArrowLeft, FiMail } from "react-icons/fi"
import { motion } from "framer-motion"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isValidLink, setIsValidLink] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [progress, setProgress] = useState(0)
  const [linkStatus, setLinkStatus] = useState("verifying")

  // Get params from URL
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  }

  // Password strength validation
  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 8
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    const hasNumber = /\d/.test(pass)
    const strength = [
      hasMinLength,
      hasSpecialChar,
      hasNumber,
      pass.length >= 12
    ].filter(Boolean).length

    const calculatedProgress = (strength / 4) * 100

    if (!pass) return { progress: 0, message: "Password must be at least 8 digit long and contain one special character", color: "text-red-400" }
    if (!hasMinLength) return { progress: calculatedProgress, message: "Minimum 8 characters", color: "text-red-400" }

    let message = "Good start"
    let color = "text-yellow-600"

    if (strength >= 3) {
      message = "Strong password!"
      color = "text-green-600"
    } else if (strength >= 2) {
      message = "Almost there must contain 1 special character"
      color = "text-yellow-600"
    }

    return { progress: calculatedProgress, message, color }
  }

  // Update progress when password changes
  useEffect(() => {
    const { progress } = validatePassword(password)
    setProgress(progress)
  }, [password])

  const passwordValidation = useMemo(() => validatePassword(password), [password])

  // Validate the reset link on component mount
  useEffect(() => {
    const validateResetLink = async () => {
      if (!userId || !secret || secret.length > 256) {
        setLinkStatus("invalid")
        return
      }

      try {
        await account.updateRecovery(userId, secret, "dummyPassword", "dummyPassword")
        setLinkStatus("valid")
        setIsValidLink(true)
      } catch (error) {
        if (error.message.includes('Invalid token') || error.message.includes('expired')) {
          setLinkStatus("expired")
        } else {
          setLinkStatus("valid")
          setIsValidLink(true)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      if (linkStatus === "verifying") {
        setLinkStatus("invalid")
        toast.error("Verification timed out. Please try again.")
      }
    }, 60000)

    validateResetLink()

    return () => clearTimeout(timeoutId)
  }, [userId, secret])

  useEffect(() => {
    if (linkStatus === "invalid") {
      toast.error("Invalid reset link format")
      router.push("/auth/forgot-password")
    } else if (linkStatus === "expired") {
      toast.error("This reset link has expired or been used already please request new one")
      router.push("/auth/forgot-password")
    }
  }, [linkStatus, router])

  const handleResetPassword = async (e) => {
    e.preventDefault()

    if (!isValidLink) return
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsLoading(true)
    try {
      await account.updateRecovery(userId, secret, password, password)

      try {
        await account.deleteSessions()
      } catch (error) {
        console.log("No sessions to delete")
      }

      toast.success("Password updated successfully! Please login with your new password")
      router.push("/auth/login")

    } catch (error) {
      console.error("Reset error:", error)
      
      if (error.message.includes('Invalid token')) {
        toast.error("This link is no longer valid. Please request a new password reset.")
        router.push("/auth/forgot-password")
      } else {
        toast.error(error.message || "Failed to reset password. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (linkStatus === "verifying") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <FiLoader className="animate-spin mx-auto text-indigo-600 text-4xl mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Verifying reset link...</h2>
          <p className="text-gray-600">This should only take a moment</p>
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-pulse" style={{ width: "70%" }} />
          </div>
        </div>
      </div>
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
            <h2 className="text-3xl font-bold">Secure Your Account</h2>
            <p className="opacity-90">Set a new strong password for your account</p>
          </div>
          <div className="mt-8 relative h-64">
            <div className="absolute inset-0 bg-[url('/images/auth-illustration.svg')] bg-contain bg-no-repeat bg-center opacity-20" />
          </div>
        </div>

        {/* Form Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:w-1/2 p-8 sm:p-10">
          <Link href="/auth/login">
            <button className="flex cursor-pointer items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors">
              <FiArrowLeft className="mr-2" />
              Back to login
            </button>
          </Link>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Create your new secure password</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-black"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              <div className="mt-2">
                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 ease-out"
                    style={{
                      width: `${progress}%`,
                      backgroundColor:
                        progress < 50 ? '#f59e0b' :
                          progress < 75 ? '#3b82f6' :
                            '#10b981'
                    }}
                  />
                </div>
                <p className={`text-sm mt-1 ${passwordValidation.color}`}>
                  {passwordValidation.message}
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none text-black"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading || password !== confirmPassword}
                className={`w-full flex justify-center cursor-pointer items-center py-3.5 px-6 rounded-lg bg-indigo-600 text-white font-medium transition-all ${isLoading ? 'opacity-75' : 'hover:bg-indigo-700'
                  } ${password !== confirmPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="mr-2" />
                    Reset Password
                  </>
                )}
              </button>
            </motion.div>
          </form>

          {/* Support Section */}
          <motion.div variants={itemVariants} className="mt-10 pt-6 border-t border-gray-200 text-center">
            <h3 className="text-sm font-medium text-gray-600">Need help?</h3>
            <p className="text-sm text-gray-500 mt-1">
              Contact our <Link href="/support" className="text-indigo-600 hover:text-indigo-500">support team</Link>
            </p>
            <p className="text-xs text-gray-400 mt-1">We're here to assist you 24/7</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}