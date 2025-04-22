"use client"

import { Client, Account } from "appwrite"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)

export function useGoogleAuth() {
  const signInWithGoogle = async (isSignup = false) => {
    try {
      // The URL where the user will be redirected after successful authentication
      const redirectUrl = `${window.location.origin}/auth/oauth-callback?mode=${isSignup ? "signup" : "login"}&provider=google`

      // The URL where the user will be redirected if authentication fails
      const failureUrl = `${window.location.origin}/auth/${isSignup ? "signup" : "login"}?error=authentication_failed&provider=google`

      // Create OAuth2 session with Google
      // Adding prompt=select_account forces Google to show the account selector
      await account.createOAuth2Session(
        "google",
        redirectUrl,
        failureUrl,
        // Add scopes for profile and email
        ["profile", "email"],
        // This is the key part - prompt=select_account forces Google to show the account picker
        "prompt=select_account",
      )
    } catch (error) {
      console.error("Google authentication error:", error)
      throw error
    }
  }

  return { signInWithGoogle }
}
