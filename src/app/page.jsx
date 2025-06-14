"use client";
import { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import LoginPage from "./auth/login/page";

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const user = await account.get();
        console.log("User found:", user);

        // 🔹 If user is logged in, redirect to dashboard
        router.push("/dashboard");
      } catch (error) {
        console.warn("No active session, showing login page...");
        setLoading(false); // Stop loading and show login page
      }
    };

    checkUserSession();
  }, []);

  if (loading) {
    return <div className="flex h-screen bg-gradient-to-br from-indigo-50 to-blue-100 items-center justify-center">Loading please wait...</div>;
  }

  return <LoginPage />;
}
