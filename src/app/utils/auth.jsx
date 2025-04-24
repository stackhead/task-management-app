import { useGoogleAuth } from "@/hooks/use-google-auth"

export const signInWithGoogle = async (isSignup) => {
  const { signInWithGoogle: googleSignIn } = useGoogleAuth()
  await googleSignIn(isSignup)
}
