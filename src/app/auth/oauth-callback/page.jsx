"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Client, Account } from "appwrite"
import { FiLoader } from "react-icons/fi"
import toast, { Toaster } from "react-hot-toast"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)

export default function OAuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = searchParams.get("mode") || "login"
  const provider = searchParams.get("provider") || "oauth"
  const [status, setStatus] = useState("loading")
  const [message, setMessage] = useState(`Verifying your ${provider} authentication...`)

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Check if the user has an active session
        const session = await account.get()

        if (session) {
          // If we're in signup mode, we need to check if this is a new account
          if (mode === "signup") {
            try {
              // Try to get the user's creation date
              const user = await account.get()

              // Calculate how many seconds ago the user was created
              const createdSeconds = Math.floor((Date.now() - new Date(user.$createdAt).getTime()) / 1000)

              // If the user was created less than 10 seconds ago, it's a new signup
              const isNewUser = createdSeconds < 10

              if (isNewUser) {
                setStatus("success")
                setMessage("Account created successfully! Redirecting to dashboard...")
                toast.success(`Welcome ${user.name || "to our platform"}!`)
              } else {
                // User already existed
                setStatus("warning")
                setMessage("You already have an account. Signing you in...")
                toast.success(`Welcome back, ${user.name || "user"}!`)
              }
            } catch (error) {
              console.error("Error checking user status:", error)
              // Continue with login flow if we can't determine
              setStatus("success")
              setMessage("Authentication successful! Redirecting...")
            }
          } else {
            // Normal login flow
            setStatus("success")
            setMessage("Authentication successful! Redirecting...")
            toast.success("Login successful!")
          }

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard")
          }, 1500)
        } else {
          throw new Error("No session found")
        }
      } catch (error) {
        console.error("Session verification error:", error)

        // Check if this is a "User not found" error
        if (error.code === 404 && mode === "login") {
          setStatus("error")
          setMessage("No account found with this email. Please sign up first.")

          setTimeout(() => {
            router.push("/auth/signup?error=account_not_found")
          }, 2000)
        } else {
          setStatus("error")
          setMessage("Authentication failed. Please try again.")

          setTimeout(() => {
            router.push(
              `/auth/${mode === "signup" ? "signup" : "login"}?error=authentication_failed&provider=${provider}`,
            )
          }, 2000)
        }
      }
    }

    verifySession()
  }, [router, mode, provider])

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

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "loading" && <FiLoader className="animate-spin mx-auto text-indigo-600 text-4xl mb-4" />}

        {status === "success" && (
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {status === "warning" && (
          <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        )}

        {status === "error" && (
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        <h2
          className={`text-2xl font-bold mb-2 ${
            status === "success"
              ? "text-green-600"
              : status === "warning"
                ? "text-yellow-600"
                : status === "error"
                  ? "text-red-600"
                  : "text-indigo-600"
          }`}
        >
          {status === "success"
            ? "Success!"
            : status === "warning"
              ? "Account Exists"
              : status === "error"
                ? "Authentication Failed"
                : "Processing"}
        </h2>

        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
