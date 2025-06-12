"use client"

import { useState, useEffect } from "react"
import { databases, ID, DATABASE_ID, USERS_COLLECTION_ID, account } from "@/lib/appwrite"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { Command, CommandList, CommandGroup, CommandInput, CommandItem, CommandEmpty } from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { countries } from "@/lib/countries"
import { countryTelephoneCodes } from "@/lib/phone-codes"
import { months } from "@/lib/date-utils"
import { toast } from "sonner"

const MyProfile = ({ user }) => {
  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    country: "",
    phoneCode: "",
    phoneNumber: "",
    location: "",
    birthDay: "",
    birthMonth: "",
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [showEmailVerify, setShowEmailVerify] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteInput, setDeleteInput] = useState("")
  const [password, setPassword] = useState("")

  // Dropdown states
  const [openCountry, setOpenCountry] = useState(false)
  const [openPhoneCode, setOpenPhoneCode] = useState(false)
  const [openMonth, setOpenMonth] = useState(false)

  // Initialize form data from user
  useEffect(() => {
    if (user && user.profile) {
      setFormData({
        firstName: user.profile.firstName || user.name?.split(" ")[0] || "",
        lastName: user.profile.lastName || user.name?.split(" ")[1] || "",
        country: user.profile.country || "",
        phoneCode: user.profile.phoneCode || "",
        phoneNumber: user.profile.phoneNumber || "",
        location: user.profile.location || "",
        birthDay: user.profile.birthDay || "",
        birthMonth: user.profile.birthMonth || "",
      })
    } else if (user) {
      // If no profile data yet, initialize with basic user data
      setFormData({
        firstName: user.name?.split(" ")[0] || "",
        lastName: user.name?.split(" ")[1] || "",
        country: "",
        phoneCode: "",
        phoneNumber: "",
        location: "",
        birthDay: "",
        birthMonth: "",
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country }))
    setOpenCountry(false)

    // Auto-select the phone code for the selected country
    const countryData = countryTelephoneCodes.find((c) => c.name === country)
    if (countryData) {
      setFormData((prev) => ({ ...prev, phoneCode: countryData.code }))
    }
  }

  const handlePhoneCodeSelect = (code) => {
    setFormData((prev) => ({ ...prev, phoneCode: code }))
    setOpenPhoneCode(false)
  }

  const handleMonthSelect = (month) => {
    setFormData((prev) => ({ ...prev, birthMonth: month }))
    setOpenMonth(false)
  }

  const handleEmailChange = () => {
    setShowEmailVerify(true)
  }

  const handleVerifyWithPassword = async () => {
    try {
      toast.success("Email verification successful", {
        description: "Your email has been updated.",
      })

      setShowEmailVerify(false)
      setPassword("")
    } catch (error) {
      toast.error("Verification failed", {
        description: error.message,
      })
    }
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      console.log("Saving profile changes for user:", user.$id)

      // Check if user already has a profile document
      let documentId
      let method = "create"

      if (user.profile && user.profile.$id) {
        documentId = user.profile.$id
        method = "update"
        console.log("Updating existing profile document:", documentId)
      } else {
        console.log("Creating new profile document")
      }

      const profileData = {
        userId: user.$id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        phoneCode: formData.phoneCode,
        phoneNumber: formData.phoneNumber,
        location: formData.location,
        birthDay: formData.birthDay,
        birthMonth: formData.birthMonth,
      }

      console.log("Profile data to save:", profileData)

      // Use "any" permissions for now to debug
      if (method === "create") {
        const result = await databases.createDocument(DATABASE_ID, USERS_COLLECTION_ID, ID.unique(), profileData, [
          'read("any")',
          'update("any")',
          'delete("any")',
        ])
        console.log("Created profile document:", result)
      } else {
        const result = await databases.updateDocument(DATABASE_ID, USERS_COLLECTION_ID, documentId, profileData)
        console.log("Updated profile document:", result)
      }

      toast.success("Profile updated", {
        description: "Your profile information has been saved.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast.error("Error saving profile", {
        description: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteInput !== "Delete") return

    try {
      setLoading(true)

      // Delete user profile document
      if (user.profile && user.profile.$id) {
        await databases.deleteDocument(DATABASE_ID, USERS_COLLECTION_ID, user.profile.$id)
      }

      // Delete user account
      await account.delete()

      toast.success("Account deleted", {
        description: "Your account has been permanently deleted.",
      })

      // Redirect to home page
      window.location.href = "/"
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Error deleting account", {
        description: error.message,
      })
    } finally {
      setLoading(false)
      setShowDeleteModal(false)
      setDeleteInput("")
    }
  }

  return (
    <div className="text-sm text-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 max-w-2xl">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">First name</Label>
          <Input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Last name</Label>
          <Input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Email</Label>
          <div className="flex items-center">
            <Input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50 text-gray-500"
            />
            <Button variant="link" className="ml-2 text-blue-600 text-xs p-0 h-auto" onClick={handleEmailChange}>
              change email
            </Button>
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Country</Label>
          <Popover open={openCountry} onOpenChange={setOpenCountry}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCountry}
                className="w-full justify-between border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-10 bg-white hover:bg-gray-50"
              >
                <span className="text-gray-900">{formData.country || "Country"}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0 bg-white border border-gray-200">
              <Command className="bg-white">
                <CommandInput placeholder="Search country..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {countries.map((country) => (
                      <CommandItem
                        key={country}
                        value={country}
                        onSelect={() => handleCountrySelect(country)}
                        className="hover:bg-gray-100"
                      >
                        <Check
                          className={cn("mr-2 h-4 w-4", formData.country === country ? "opacity-100" : "opacity-0")}
                        />
                        {country}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Phone</Label>
          <div className="flex">
            <Popover open={openPhoneCode} onOpenChange={setOpenPhoneCode}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openPhoneCode}
                  className="w-24 justify-between border border-gray-300 rounded-md px-2 py-2 text-sm mr-2 h-10 bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-900">{formData.phoneCode || "+000"}</span>
                  <ChevronsUpDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-white border border-gray-200">
                <Command className="bg-white">
                  <CommandInput placeholder="Search country..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-y-auto">
                      {countryTelephoneCodes.map((country) => (
                        <CommandItem
                          key={country.code}
                          value={country.name}
                          onSelect={() => handlePhoneCodeSelect(country.code)}
                          className="hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <span className="w-6 h-4 mr-2 flex-shrink-0">{country.flag}</span>
                            <span className="flex-grow">{country.name}</span>
                            <span className="text-gray-500">{country.code}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Input
              type="tel"
              name="phoneNumber"
              placeholder="000 000 00 00"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Location</Label>
          <Input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
          />
        </div>

        <div className="flex space-x-2">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Birthday</Label>
            <Input
              type="text"
              name="birthDay"
              placeholder="Day"
              value={formData.birthDay}
              onChange={handleInputChange}
              className="w-20 border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
            />
          </div>
          <div className="pt-5">
            <Popover open={openMonth} onOpenChange={setOpenMonth}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openMonth}
                  className="w-32 justify-between border border-gray-300 rounded-md px-3 py-2 text-sm h-10 bg-white hover:bg-gray-50"
                >
                  <span className="text-gray-900">{formData.birthMonth || "Month"}</span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-32 p-0 bg-white border border-gray-200">
                <Command className="bg-white">
                  <CommandList>
                    <CommandGroup>
                      {months.map((month) => (
                        <CommandItem
                          key={month}
                          value={month}
                          onSelect={() => handleMonthSelect(month)}
                          className="hover:bg-gray-100"
                        >
                          <Check
                            className={cn("mr-2 h-4 w-4", formData.birthMonth === month ? "opacity-100" : "opacity-0")}
                          />
                          {month}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSaveChanges}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 border-0"
      >
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {/* Delete Account Section */}
      <div className="mt-16 border-t pt-8 max-w-2xl">
        <h3 className="text-md font-medium mb-2 text-gray-900">Delete account</h3>
        <p className="text-gray-500 text-sm mb-4">
          After deleting your account you will lose all related information including tasks, events, projects, notes
          etc. You will not be able to recover it later, so think twice before doing this.
        </p>
        <Button
          onClick={() => setShowDeleteModal(true)}
          variant="ghost"
          className="flex items-center text-red-600 text-sm space-x-1 hover:underline p-0 h-auto bg-transparent hover:bg-transparent"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7L5 7M6 7L6 19a2 2 0 002 2h8a2 2 0 002-2V7m-6 4v6m-4-6v6m8-10V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2h10z"
            />
          </svg>
          <span>Delete account</span>
        </Button>
      </div>

      {/* Email Verification Dialog */}
      <Dialog open={showEmailVerify} onOpenChange={setShowEmailVerify}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">Verify it's you to perform this action</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col space-y-4 py-4">
            <Button
              variant="outline"
              className="flex items-center justify-center space-x-2 bg-white border-gray-300 hover:bg-gray-50"
            >
              <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path
                    fill="#4285F4"
                    d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                  />
                  <path
                    fill="#34A853"
                    d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                  />
                  <path
                    fill="#EA4335"
                    d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                  />
                </g>
              </svg>
              <span className="text-gray-700">Verify with Google</span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or verify with account password</span>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border-gray-300"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailVerify(false)}
                  className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button onClick={handleVerifyWithPassword} className="bg-blue-600 text-white hover:bg-blue-700">
                  Verify
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-900">Delete account</DialogTitle>
            <DialogDescription className="text-gray-600">
              Are you sure you want to delete this account? All related information, including tasks, events and
              projects will be lost forever.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              placeholder='Enter here "Delete"'
              value={deleteInput}
              onChange={(e) => setDeleteInput(e.target.value)}
              className="w-full bg-white border-gray-300"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteInput("")
                }}
                className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                disabled={deleteInput !== "Delete" || loading}
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                {loading ? "Deleting..." : "Delete account"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MyProfile
