"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { account, databases, DATABASE_ID, USERS_COLLECTION_ID, Query } from "@/lib/appwrite"
import MyProfile from "@/components/profile/my-profile"
import Preferences from "@/components/profile/preferences"
import Integrations from "@/components/profile/integrations"
import Security from "@/components/profile/security"
import { Tabs, TabsContent } from "@/components/ui/tabs"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("my-profile")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        setLoading(true)
        console.log("Checking user authentication...")
        const currentUser = await account.get()
        console.log("User authenticated:", currentUser)

        // Fetch user profile data from database with proper Query syntax
        try {
          console.log("Fetching user profile data for user ID:", currentUser.$id)
          const userData = await databases.listDocuments(DATABASE_ID, USERS_COLLECTION_ID, [
            Query.equal("userId", currentUser.$id),
          ])
          console.log("User profile data:", userData)

          if (userData.documents.length > 0) {
            setUser({
              ...currentUser,
              profile: userData.documents[0],
            })
          } else {
            console.log("No profile data found, using account data only")
            setUser(currentUser) // No profile data yet, just use the account data
          }
        } catch (err) {
          console.error("Error fetching user profile:", err)
          setUser(currentUser) // Fallback to just account data
        }
      } catch (error) {
        console.error("Not authenticated:", error)
        router.push("/login") // Redirect to login if not authenticated
      } finally {
        setLoading(false)
      }
    }

    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-6 border-b border-gray-200 bg-white">
            <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
            <p className="text-gray-600 mt-1">Manage your account preferences and settings</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            {/* Custom Tab Navigation */}
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="px-6">
                <nav className="flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab("my-profile")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === "my-profile"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    My Profile
                  </button>
                  <button
                    onClick={() => setActiveTab("preferences")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === "preferences"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Preferences
                  </button>
                  <button
                    onClick={() => setActiveTab("integrations")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === "integrations"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Integrations
                  </button>
                  <button
                    onClick={() => setActiveTab("security")}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === "security"
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    Security
                  </button>
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6 bg-white">
              <TabsContent value="my-profile" className="mt-0 focus-visible:outline-none">
                {user && <MyProfile user={user} />}
              </TabsContent>

              <TabsContent value="preferences" className="mt-0 focus-visible:outline-none">
                {user && <Preferences user={user} />}
              </TabsContent>

              <TabsContent value="integrations" className="mt-0 focus-visible:outline-none">
                {user && <Integrations user={user} />}
              </TabsContent>

              <TabsContent value="security" className="mt-0 focus-visible:outline-none">
                {user && <Security user={user} />}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
