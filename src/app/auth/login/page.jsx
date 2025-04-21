"use client"

import { useState, useEffect } from "react"
import { Client, Account } from "appwrite"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { FiLogIn, FiLoader, FiEye, FiEyeOff, FiMail, FiLock } from "react-icons/fi"
import { motion } from "framer-motion"
import { useGoogleAuth } from "../../../hooks/use-google-auth"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const { signInWithGoogle } = useGoogleAuth()

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error("Please enter both email and password")
      return
    }

    setIsLoading(true)
    const loadingToast = toast.loading("Authenticating...")

    try {
      await account.createEmailPasswordSession(email, password)
      toast.dismiss(loadingToast)
      toast.success("Login successful! Redirecting...")
      router.push("/dashboard")
    } catch (error) {
      console.error(error)
      toast.dismiss(loadingToast)

      if (error.code === 429) {
        toast.error("Too many login attempts. Please wait before trying again.")
      } else if (error.code === 401) {
        toast.error("Incorrect email or password")
      } else {
        toast.error("Login failed. Please try again later.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google login error:", error)
      toast.error("Failed to sign in with Google. Please try again.")
    }
  }

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await account.get()
        if (session) {
          router.push("/dashboard")
        }
      } catch (error) {
        console.log("No active session found")
      } finally {
        setCheckingSession(false)
      }
    }

    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setCheckingSession(false)
    }, 3000) // 3 seconds timeout

    checkSession()

    return () => clearTimeout(timeoutId)
  }, [router])

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto text-indigo-600 text-4xl mb-4" />
          <p className="text-gray-700">Checking your session...</p>
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
            <h2 className="text-3xl font-bold">Welcome Back</h2>
            <p className="opacity-90">We're excited to see you again!</p>
          </div>
          <div className="mt-8 relative h-64">
            <div className="absolute inset-0 bg-[url('/images/auth-illustration.svg')] bg-contain bg-no-repeat bg-center opacity-20" />
          </div>
        </div>

        {/* Form Section */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:w-1/2 p-8 sm:p-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h1>
            <p className="text-gray-600">Access your account to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div variants={itemVariants}>
              <div className="relative group">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full text-black pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div className="relative group">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                  className="w-full pl-10 text-black pr-12 py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Forgot password?
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex cursor-pointer justify-center items-center py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all relative overflow-hidden"
              >
                {isLoading ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    Signing In...
                  </>
                ) : (
                  <>
                    <FiLogIn className="mr-2" />
                    Sign In
                  </>
                )}
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex text-black cursor-pointer items-center justify-center py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.835 0 3.456.705 4.691 1.942l3.149-3.149A9.97 9.97 0 0012.545 2C7.021 2 2.545 6.477 2.545 12s4.476 10 10 10c5.523 0 10-4.477 10-10a9.967 9.967 0 00-2.195-6.285l-5.26 5.285z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex cursor-pointer text-black items-center justify-center py-2.5 px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#181717"
                    d="M12 2A10 10 0 002 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"
                  />
                </svg>
                GitHub
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-8 text-center text-sm text-gray-600">
            New on our platform?{" "}
            <Link href="/auth/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
              Create account
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
