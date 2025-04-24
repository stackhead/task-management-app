"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { Client, Account, ID } from "appwrite"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast, { Toaster } from "react-hot-toast"
import { FiUserPlus, FiLoader, FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi"
import { motion } from "framer-motion"
import { useGoogleAuth } from "../../../hooks/use-google-auth"
import { useGithubAuth } from "../../../hooks/use-github-auth"
import Image from 'next/image'

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)

function SignupContent() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [progress, setProgress] = useState(0)
  const { signInWithGoogle } = useGoogleAuth()
  const { signInWithGithub } = useGithubAuth()

  // Parse search params on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const errorParam = params.get("error")
      const providerParam = params.get("provider") || ""

      setError(errorParam)
      setProvider(providerParam)
    }
  }, [])

  // Show error message if redirected with error
  useEffect(() => {
    if (error === "authentication_failed") {
      toast.error(`Authentication failed with ${provider || "provider"}. Please try again.`)
    } else if (error === "account_not_found") {
      toast.error("No account found with this email. Please sign up.")
    }
  }, [error, provider])

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

  // Pure validation function (no state updates)
  const validatePassword = (pass) => {
    const hasMinLength = pass.length >= 8;
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasRequiredChar = hasSpecialChar || hasNumber;

    // Initial empty check
    if (!pass) {
        return {
            progress: 0,
            message: "Password must be 8 characters long and contain one special character or number",
            color: "text-red-400",
        };
    }

    // Check minimum length first
    if (!hasMinLength) {
        return {
            progress: (pass.length / 8) * 100,
            message: "Minimum 8 characters required",
            color: "text-red-400",
        };
    }

    // Check for at least one special character or number
    if (!hasRequiredChar) {
        return {
            progress: 0,
            message: "Must contain at least one number or special character",
            color: "text-red-400",
        };
    }

    // Calculate strength only after basic requirements are met
    const strengthFactors = [
        hasSpecialChar && hasNumber,  // Both special and number
        pass.length >= 12,            // Long password
        /[A-Z]/.test(pass),           // Contains uppercase
        /[a-z]/.test(pass)            // Contains lowercase
    ].filter(Boolean).length;

    const calculatedProgress = (strengthFactors / 4) * 100;

    let message = "Good start";
    let color = "text-yellow-600";

    if (strengthFactors >= 3) {
        message = "Strong password!";
        color = "text-green-600";
    } else if (strengthFactors >= 2) {
        message = "Almost there - try adding more complexity";
        color = "text-yellow-600";
    }

    return { 
        progress: calculatedProgress, 
        message, 
        color 
    };
  };

  // Update progress only when password changes
  useEffect(() => {
    const { progress } = validatePassword(password)
    setProgress(progress)
  }, [password])

  // Memoize password validation
  const passwordValidation = useMemo(() => {
    return validatePassword(password)
  }, [password])

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handleSignup = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      toast.error("All fields are required")
      return
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long")
      return
    }

    setIsLoading(true)
    let loadingToast = toast.loading("Creating your account...")

    try {
      // Step 1: Create account
      await account.create(ID.unique(), email, password, name)
      toast.dismiss(loadingToast)
      toast.success("Account created successfully!")

      // Step 2: Automatically log in the user
      loadingToast = toast.loading("Logging you in...")
      await account.createEmailPasswordSession(email, password)
      toast.dismiss(loadingToast)

      // Step 3: Get user session to verify login
      loadingToast = toast.loading("Setting up your dashboard...")
      const user = await account.get()

      if (user) {
        toast.dismiss(loadingToast)
        toast.success(`Welcome ${user.name}!`)
        router.push("/dashboard")
      } else {
        throw new Error("Failed to establish session")
      }
    } catch (error) {
      console.error(error)
      toast.dismiss(loadingToast)

      if (error.type === "user_already_exists") {
        toast.error("An account with this email already exists")
      } else {
        toast.error(error.message || "Failed to complete signup. Please try again.")
      }

      if (error.message.includes("session")) {
        toast(
          <span>
            Account created but login failed. Try{" "}
            <Link href="/auth/login" className="underline">
              logging in
            </Link>
          </span>,
          { duration: 6000 },
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      // Pass true to indicate this is a signup
      await signInWithGoogle(true)
    } catch (error) {
      console.error("Google signup error:", error)
      toast.error("Failed to sign up with Google. Please try again.")
    }
  }

  const handleGithubSignup = async () => {
    try {
      // Pass true to indicate this is a signup
      await signInWithGithub(true)
    } catch (error) {
      console.error("GitHub signup error:", error)
      toast.error("Failed to sign up with GitHub. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col ">
      <div className="flex flex-row justify-between items-center px-4">
        <Image
          src={"/svgs/logo.svg"}
          alt="Logo"
          width={200}
          height={200}
        />
        <div className="flex flex-row items-center space-x-2">
          <div className="text-gray-900">Already have an account?</div>
          <Link href="/auth/login">
            <button className="text-white py-2 px-4 font-medium text-[16px] rounded-xl drop-shadow-2xl cursor-pointer shadow-indigo-800 bg-indigo-600 hover:bg-indigo-700 transition-colors">
              Sign in
            </button>
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
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
          <div className="md:w-1/2 bg-gradient-to-br from-indigo-600 to-blue-500 p-8 hidden md:flex flex-col">
            <div className="space-y-4 text-white">
              <h2 className="text-3xl font-bold">Join Our Community</h2>
              <p className="opacity-90">Start your journey with us and unlock amazing features</p>
            </div>
          </div>

          {/* Form Section */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="md:w-1/2 p-8 sm:p-10">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Get started with your free account</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-6">
              <motion.div variants={itemVariants}>
                <div className="relative group">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500" />
                  <input
                    id="name"
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                    required
                    className="w-full pl-10 pr-4 text-black py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                </div>
              </motion.div>

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
                    className="w-full pl-10 pr-4 text-black py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
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
                    minLength={8}
                    className="w-full pl-10 pr-12 text-black py-3 rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                  />
                  <button
                    type="button"
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-500 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FiEye /> : <FiEyeOff />}
                  </button>
                </div>
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 ease-out"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: progress < 50 ? "#f59e0b" : progress < 75 ? "#3b82f6" : "#10b981",
                      }}
                    />
                  </div>
                  <p className={`text-sm mt-1 ${passwordValidation.color}`}>{passwordValidation.message}</p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer flex justify-center items-center py-3.5 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-all relative overflow-hidden"
                >
                  {isLoading ? (
                    <>
                      <FiLoader className="animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="mr-2" />
                      Sign Up
                    </>
                  )}
                  {isLoading && <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />}
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
                  onClick={handleGoogleSignup}
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
                  onClick={handleGithubSignup}
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
              Need help? Contact our{" "}
              <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors">
                Support team
              </Link>
              <br/>we are available 24/7
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin mx-auto text-indigo-600 text-4xl mb-4" />
          <p className="text-gray-700">Loading signup form...</p>
        </div>
      </div>
    }>
      <SignupContent />
    </Suspense>
  )
}