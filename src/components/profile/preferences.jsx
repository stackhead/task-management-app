"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { databases, DATABASE_ID, PREFERENCES_COLLECTION_ID, ID } from "@/lib/appwrite"

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
  { value: "pt", label: "Portuguese" },
  { value: "ru", label: "Russian" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "zh", label: "Chinese" },
]

const timeZones = [
  { value: "GMT+05:00", label: "(GMT+05:00) Karachi" },
  { value: "GMT+00:00", label: "(GMT+00:00) London" },
  { value: "GMT-05:00", label: "(GMT-05:00) New York" },
  { value: "GMT-08:00", label: "(GMT-08:00) Los Angeles" },
  { value: "GMT+01:00", label: "(GMT+01:00) Paris" },
  { value: "GMT+09:00", label: "(GMT+09:00) Tokyo" },
  { value: "GMT+10:00", label: "(GMT+10:00) Sydney" },
  { value: "GMT-03:00", label: "(GMT-03:00) São Paulo" },
  { value: "GMT+08:00", label: "(GMT+08:00) Singapore" },
  { value: "GMT+02:00", label: "(GMT+02:00) Cairo" },
]

const themes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
]

const Preferences = ({ user }) => {
  const [preferences, setPreferences] = useState({
    language: "en",
    timeZone: "GMT+05:00",
    theme: "light",
    dateFormat: "31 Dec 2025",
    timeFormat: "12 hours: 9:00 PM",
    weekFormat: "Monday",
    showOrgTasks: true,
    browserNotifications: false,
  })

  const [loading, setLoading] = useState(false)

  const handleSelectChange = (key, value) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleCheckboxChange = (key, checked) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: checked,
    }))
  }

  const handleSavePreferences = async () => {
    try {
      setLoading(true)

      const preferencesData = {
        userId: user.$id,
        ...preferences,
      }

      // Save to Appwrite
      await databases.createDocument(DATABASE_ID, PREFERENCES_COLLECTION_ID, ID.unique(), preferencesData)

      toast.success("Preferences updated", {
        description: "Your preferences have been saved.",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast.error("Error saving preferences", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnableNotifications = async () => {
    try {
      if ("Notification" in window) {
        const permission = await Notification.requestPermission()
        if (permission === "granted") {
          setPreferences((prev) => ({ ...prev, browserNotifications: true }))
          toast.success("Notifications enabled", {
            description: "Browser notifications have been enabled.",
          })
        } else {
          toast.error("Notifications denied", {
            description: "Please enable notifications in your browser settings.",
          })
        }
      } else {
        toast.error("Notifications not supported", {
          description: "Your browser doesn't support notifications.",
        })
      }
    } catch (error) {
      console.error("Error enabling notifications:", error)
      toast.error("Error enabling notifications", {
        description: error.message,
      })
    }
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Language */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Language</Label>
        <Select value={preferences.language} onValueChange={(value) => handleSelectChange("language", value)}>
          <SelectTrigger className="w-64 bg-white border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value} className="hover:bg-gray-100">
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Time zone */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Time zone</Label>
        <Select value={preferences.timeZone} onValueChange={(value) => handleSelectChange("timeZone", value)}>
          <SelectTrigger className="w-64 bg-white border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {timeZones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value} className="hover:bg-gray-100">
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Theme</Label>
        <Select value={preferences.theme} onValueChange={(value) => handleSelectChange("theme", value)}>
          <SelectTrigger className="w-64 bg-white border-gray-300">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-gray-200">
            {themes.map((theme) => (
              <SelectItem key={theme.value} value={theme.value} className="hover:bg-gray-100">
                {theme.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Date format */}
      <div>
        <Label className="text-sm text-gray-600 mb-3 block">Date format</Label>
        <div className="flex space-x-4">
          <button
            onClick={() => handleSelectChange("dateFormat", "31 Dec 2025")}
            className={`px-4 py-2 rounded-md border text-sm ${
              preferences.dateFormat === "31 Dec 2025"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            31 Dec 2025
          </button>
          <button
            onClick={() => handleSelectChange("dateFormat", "Dec 31, 2025")}
            className={`px-4 py-2 rounded-md border text-sm ${
              preferences.dateFormat === "Dec 31, 2025"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Dec 31, 2025
          </button>
        </div>
      </div>

      {/* Time format */}
      <div>
        <Label className="text-sm text-gray-600 mb-3 block">Time format</Label>
        <div className="flex space-x-4">
          <button
            onClick={() => handleSelectChange("timeFormat", "12 hours: 9:00 PM")}
            className={`px-4 py-2 rounded-md border text-sm ${
              preferences.timeFormat === "12 hours: 9:00 PM"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            12 hours: 9:00 PM
          </button>
          <button
            onClick={() => handleSelectChange("timeFormat", "24 hours: 21:00")}
            className={`px-4 py-2 rounded-md border text-sm ${
              preferences.timeFormat === "24 hours: 21:00"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            24 hours: 21:00
          </button>
        </div>
      </div>

      {/* Week format */}
      <div>
        <Label className="text-sm text-gray-600 mb-3 block">Week format</Label>
        <div className="flex space-x-4">
          <button
            onClick={() => handleSelectChange("weekFormat", "Monday")}
            className={`px-4 py-2 rounded-md border text-sm ${
              preferences.weekFormat === "Monday"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Monday
          </button>
          <button
            onClick={() => handleSelectChange("weekFormat", "Sunday")}
            className={`px-4 py-2 rounded-md border text-sm ${
              preferences.weekFormat === "Sunday"
                ? "bg-blue-100 border-blue-300 text-blue-700"
                : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Sunday
          </button>
        </div>
      </div>

      {/* Organization tasks checkbox */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="org-tasks"
          checked={preferences.showOrgTasks}
          onCheckedChange={(checked) => handleCheckboxChange("showOrgTasks", checked)}
          className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
        <Label htmlFor="org-tasks" className="text-sm text-gray-700 leading-relaxed">
          Show all tasks assigned to me within the organizations in My Workspace
        </Label>
      </div>

      {/* Browser notifications */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-medium mb-4 text-gray-900">Browser notifications</h3>

        {preferences.browserNotifications ? (
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-sm text-green-800">Browser notifications are enabled</p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-600 mb-4">Browser notifications are turned off</p>
            <Button
              onClick={handleEnableNotifications}
              className="bg-blue-600 text-white hover:bg-blue-700 border-0 mb-4"
            >
              Enable notifications
            </Button>
            <div className="text-sm text-gray-600">
              <span>*Watch </span>
              <a href="#" className="text-blue-600 hover:underline">
                this video tutorial
              </a>
              <span> if you're having trouble activating browser notifications</span>
            </div>
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="pt-6">
        <Button
          onClick={handleSavePreferences}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700 border-0"
        >
          {loading ? "Saving..." : "Save Preferences"}
        </Button>
      </div>
    </div>
  )
}

export default Preferences
