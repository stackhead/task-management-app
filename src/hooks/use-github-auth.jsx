"use client"

import { Client, Account } from "appwrite"

// Initialize Appwrite client
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")

const account = new Account(client)

export function useGithubAuth() {
  const signInWithGithub = async (isSignup = false) => {
    try {
      // The URL where the user will be redirected after successful authentication
      // This should match EXACTLY what you've configured in GitHub OAuth settings
      const redirectUrl = `${window.location.origin}/auth/oauth-callback`;

      // Create OAuth2 session with GitHub
      await account.createOAuth2Session(
        "github",
        redirectUrl, // Success URL
        `${window.location.origin}/auth/signup?error=oauth_failed`, // Failure URL
        ["user:email"]
      );
    } catch (error) {
      console.error("GitHub authentication error:", error)
      throw error
    }
  }

  return { signInWithGithub }
}
