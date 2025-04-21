"use client"

import { Client, Account } from "appwrite"
import { useRouter } from "next/navigation"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)

export function useGoogleAuth() {
  const router = useRouter()

  const signInWithGoogle = async () => {
    try {
      // The URL where the user will be redirected after successful authentication
      const redirectUrl = `${window.location.origin}/auth/oauth-callback`

      // Create OAuth2 session with Google
      await account.createOAuth2Session(
        "google",
        redirectUrl,
        `${window.location.origin}/auth/login?error=authentication_failed`,
      )
    } catch (error) {
      console.error("Google authentication error:", error)
      throw error
    }
  }

  return { signInWithGoogle }
}
