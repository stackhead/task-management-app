"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Client, Account } from "appwrite"
import { FiLoader } from "react-icons/fi"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')

const account = new Account(client)

export default function OAuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState("Verifying your authentication...")

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Check if the user has an active session
        const session = await account.get()
        
        if (session) {
          setStatus('success')
          setMessage("Authentication successful! Redirecting to dashboard...")
          
          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push('/dashboard')
          }, 1500)
        } else {
          throw new Error("No session found")
        }
      } catch (error) {
        console.error("Session verification error:", error)
        setStatus('error')
        setMessage("Authentication failed. Please try again.")
        
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/auth/login?error=authentication_failed')
        }, 2000)
      }
    }

    verifySession()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === 'loading' && (
          <FiLoader className="animate-spin mx-auto text-indigo-600 text-4xl mb-4" />
        )}
        
        {status === 'success' && (
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        {status === 'error' && (
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}
        
        <h2 className={`text-2xl font-bold mb-2 ${
          status === 'success' ? 'text-green-600' : 
          status === 'error' ? 'text-red-600' : 
          'text-indigo-600'
        }`}>
          {status === 'success' ? 'Success!' : 
           status === 'error' ? 'Authentication Failed' : 
           'Processing'}
        </h2>
        
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}
