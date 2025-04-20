"use client"
import { useState, useEffect } from "react"
import { account } from "@/components/services/appwrite"
import { useRouter, useSearchParams } from "next/navigation"
import toast, { Toaster } from "react-hot-toast"
import { FiLock, FiLoader, FiCheckCircle, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi"
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

  // Get params from URL
  const userId = searchParams.get("userId")
  const secret = searchParams.get("secret")

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

    if (!pass) return { progress: 0, message: "Password must be at least 8 characters", color: "text-red-400" }
    if (!hasMinLength) return { progress: calculatedProgress, message: "Minimum 8 characters", color: "text-red-400" }
    
    let message = "Good start"
    let color = "text-yellow-400"
    
    if (strength >= 3) {
      message = "Strong password!"
      color = "text-green-400"
    } else if (strength >= 2) {
      message = "Almost there"
      color = "text-yellow-400"
    }

    return { progress: calculatedProgress, message, color }
  }

  // Update progress when password changes
  useEffect(() => {
    const { progress } = validatePassword(password)
    setProgress(progress)
  }, [password])

  const passwordValidation = validatePassword(password)

  // Validate the reset link on component mount
  useEffect(() => {
    if (!userId || !secret || secret.length > 256) {
      toast.error("Invalid or expired reset link")
      router.push("/auth/forgot-password")
    } else {
      setIsValidLink(true)
    }
  }, [userId, secret, router])

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
      // 1. Complete password reset (this creates a session)
      await account.updateRecovery(
        userId,
        secret,
        password,
        password
      )

      // 2. Get the current user data
      const user = await account.get()
      
      // 3. Store user data in state/localStorage if needed
      localStorage.setItem('user', JSON.stringify({
        id: user.$id,
        name: user.name,
        email: user.email,
        // Add other fields you need
      }));
      
      toast.success(`Welcome back, ${user.name}! Password updated successfully`)
      router.push("/dashboard") // Redirect to dashboard or home
    } catch (error) {
      console.error("Reset error:", error)
      toast.error(error.message || "Failed to reset password")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isValidLink) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100">
        <p>Verifying reset link...</p>
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
            <h2 className="text-3xl font-bold">Welcome Back!</h2>
            <p className="opacity-90">Your account is now secured with a new password</p>
          </div>
          <div className="mt-8 relative h-64">
            <div className="absolute inset-0 bg-[url('/images/auth-illustration.svg')] bg-contain bg-no-repeat bg-center opacity-20" />
          </div>
        </div>

        {/* Form Section */}
        <div className="md:w-1/2 p-8 sm:p-10">
        <Link href="/auth/login">
        <button 

className="flex cursor-pointer items-center text-gray-600 hover:text-indigo-600 mb-6 transition-colors"
>
                    <FiArrowLeft className="mr-2" />
                    Back
                  </button>
                      </Link>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h1>
            <p className="text-gray-600">Create your new secure password</p>
          </div>

          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-md font-medium text-gray-900">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
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
                <p className={`text-xs mt-1 ${passwordValidation.color}`}>
                  {passwordValidation.message}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-md font-medium text-gray-900">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 text-black focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || password !== confirmPassword}
              className={`w-full flex justify-center items-center py-3.5 px-6 rounded-lg bg-indigo-600 text-white font-medium transition-all ${
                isLoading ? 'opacity-75' : 'hover:bg-indigo-700'
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
          </form>
        </div>
      </motion.div>
    </div>
  )
}