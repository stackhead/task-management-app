"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

const Security = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessionActivity, setSessionActivity] = useState([
    {
      id: 1,
      device: "Chrome on Windows",
      location: "Lahore, Pakistan",
      ip: "192.168.1.1",
      time: "2023-06-10T14:30:00",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "Lahore, Pakistan",
      ip: "192.168.1.2",
      time: "2023-06-09T10:15:00",
      current: false,
    },
  ])

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

      // For demo purposes
      await new Promise((resolve) => setTimeout(resolve, 1000))

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
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleTwoFactor = () => {
    setTwoFactorEnabled(!twoFactorEnabled)

    toast.success(twoFactorEnabled ? "2FA Disabled" : "2FA Enabled", {
      description: twoFactorEnabled
        ? "Two-factor authentication has been disabled."
        : "Two-factor authentication has been enabled.",
    })
  }

  const handleTerminateSession = (id) => {
    setSessionActivity((prev) => prev.filter((session) => session.id !== id))

    toast.success("Session terminated", {
      description: "The selected session has been terminated.",
    })
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
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 bg-white border-gray-300"
              required
            />
          </div>

          <div>
            <Label htmlFor="new-password" className="text-gray-700">
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 bg-white border-gray-300"
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-gray-700">
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 bg-white border-gray-300"
              required
            />
          </div>

          <Button type="submit" disabled={loading} className="bg-blue-600 text-white hover:bg-blue-700 border-0">
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
            className="data-[state=checked]:bg-blue-600"
          />
        </div>

        {twoFactorEnabled && (
          <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 border border-blue-200">
            <p>Two-factor authentication is enabled for your account.</p>
          </div>
        )}
      </div>

      {/* Active Sessions */}
      <div>
        <h3 className="text-md font-medium mb-4 text-gray-900">Active Sessions</h3>
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
      </div>
    </div>
  )
}

export default Security
