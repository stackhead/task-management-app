"use client"

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function ResetSent() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Reset Link Sent</h1>
        <p className="mb-6">
          We've sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </p>
        <Link 
          href="/auth/login"
          className="text-indigo-600 hover:text-indigo-800"
        >
          Back to Login
        </Link>
      </div>
    </div>
  )
}