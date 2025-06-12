"use client"

import { useState, useEffect } from "react"
import { account } from "@/lib/appwrite"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

const Security = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionActivity, setSessionActivity] = useState([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  // Load actual sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        setLoadingSessions(true)
        const sessions = await account.listSessions()

        const formattedSessions = sessions.sessions.map((session, index) => ({
          id: session.$id,
          device: `${session.clientName} on ${session.osName}`,
          location: `${session.countryName || "Unknown"}, ${session.ip}`,
          ip: session.ip,
          time: session.$createdAt,
          current: session.current,
        }))

        setSessionActivity(formattedSessions)
      } catch (error) {
        console.error("Error loading sessions:", error)
        // Fallback to dummy data if API fails
        setSessionActivity([
          {
            id: "current",
            device: "Current Browser",
            location: "Current Location",
            ip: "Your IP",
            time: new Date().toISOString(),
            current: true,
          },
        ])
      } finally {
        setLoadingSessions(false)
      }
    }

    loadSessions()
  }, [])

  const handleChangePassword = async (e) => {
    e.preventDefault()

    // Validation
    if (newPassword !== confirmPassword) {
      toast.error("Passwords don't match", {
        description: "New password and confirmation must match.",
      })
      return
    }

    if (newPassword.length < 8) {
      toast.error("Password too short", {
        description: "Password must be at least 8 characters long.",
      })
      return
    }

    try {
      setLoading(true)

      // Use Appwrite's updatePassword method
      await account.updatePassword(newPassword, currentPassword)

      toast.success("Password updated", {
        description: "Your password has been changed successfully.",
      })

      // Clear form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("Error changing password", {
        description: error.message || "Failed to change password. Please check your current password.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTwoFactor = async () => {
    try {
      if (!twoFactorEnabled) {
        // Enable 2FA - In a real implementation, this would involve:
        // 1. Generating a secret key
        // 2. Showing QR code for authenticator app
        // 3. Verifying the first code
        toast.info("2FA Setup", {
          description: "Two-factor authentication setup would be implemented here with QR code generation.",
        })
      } else {
        // Disable 2FA
        toast.success("2FA Disabled", {
          description: "Two-factor authentication has been disabled.",
        })
      }

      setTwoFactorEnabled(!twoFactorEnabled)
    } catch (error) {
      console.error("Error toggling 2FA:", error)
      toast.error("Error", {
        description: "Failed to update two-factor authentication settings.",
      })
    }
  }

  const handleTerminateSession = async (sessionId) => {
    try {
      await account.deleteSession(sessionId)

      // Remove from local state
      setSessionActivity((prev) => prev.filter((session) => session.id !== sessionId))

      toast.success("Session terminated", {
        description: "The selected session has been terminated.",
      })
    } catch (error) {
      console.error("Error terminating session:", error)
      toast.error("Error", {
        description: "Failed to terminate session.",
      })
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-medium mb-6 text-gray-900">Security Settings</h2>

      {/* Change Password */}
      <div className="mb-10">
        <h3 className="text-md font-medium mb-4 text-gray-900">Change Password</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <Label htmlFor="current-password" className="text-gray-700">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 bg-white border-gray-300 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showCurrentPassword ? (
                  <Eye className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="new-password" className="text-gray-700">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 bg-white border-gray-300 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showNewPassword ? (
                  <Eye className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-gray-700">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 bg-white border-gray-300 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4 text-gray-400" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 border-0 cursor-pointer">
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>

      {/* Two-Factor Authentication */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-md font-medium text-gray-900">Two-Factor Authentication</h3>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleToggleTwoFactor}
            className="data-[state=checked]:bg-blue-600 cursor-pointer"
          />
        </div>

        {twoFactorEnabled ? (
          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-200">
            <p>Two-factor authentication is enabled for your account.</p>
            <p className="mt-2 text-xs">
              Note: This is a demo implementation. In production, this would integrate with authenticator apps like
              Google Authenticator.
            </p>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-600 border border-gray-200">
            <p>Two-factor authentication is disabled.</p>
            <p className="mt-2 text-xs">Enable 2FA to add an extra layer of security to your account.</p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-md font-medium mb-4 text-gray-900">Active Sessions</h3>

        {loadingSessions ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg bg-white">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sessionActivity.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white"
              >
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-gray-900">{session.device}</h4>
                    {session.current && (
                      <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs rounded-full">Current</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {session.location} • {session.ip}
                  </p>
                  <p className="text-xs text-gray-400">{new Date(session.time).toLocaleString()}</p>
                </div>

                {!session.current && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTerminateSession(session.id)}
                    className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 bg-white"
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Security
