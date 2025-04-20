"use client"

import { account } from "@/components/services/appwrite"
import { useEffect, useState } from "react"

export default function DebugAppwrite() {
  const [methods, setMethods] = useState([])

  useEffect(() => {
    // Get all methods from the account object
    const accountMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(account)).filter(
      (method) => typeof account[method] === "function" && method !== "constructor",
    )

    setMethods(accountMethods)
  }, [])

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h2 className="text-lg font-bold mb-2">Available Appwrite Account Methods:</h2>
      <ul className="list-disc pl-5">
        {methods.map((method) => (
          <li key={method}>{method}</li>
        ))}
      </ul>
    </div>
  )
}

