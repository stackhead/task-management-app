"use client"

import { useState, useEffect } from "react"
import {
  account,
  databases,
  DATABASE_ID,
  COLUMNS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
  Query,
} from "@/components/services/appwrite"

export function useBoardState() {
  const [user, setUser] = useState(null)
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Changed default to false (light mode)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      // Set default to light mode if no saved preference
      setIsDarkMode(false)
      localStorage.setItem("kanban-theme", "light")
    }
  }, [])

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("kanban-theme", newTheme ? "dark" : "light")
  }

  // Fetch user, columns and tasks
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch user
        const loggedInUser = await account.get()
        setUser(loggedInUser)

        try {
          // Fetch columns
          const columnsResponse = await databases.listDocuments(DATABASE_ID, COLUMNS_COLLECTION_ID, [
            Query.equal("userId", loggedInUser.$id),
          ])

          setColumns(columnsResponse.documents)

          // Fetch tasks
          const tasksResponse = await databases.listDocuments(DATABASE_ID, TASKS_COLLECTION_ID, [
            Query.equal("userId", loggedInUser.$id),
          ])

          setTasks(tasksResponse.documents)
        } catch (dataError) {
          console.error("Error fetching data:", dataError)
          setError("Failed to load your board data. Please try again later.")
        }
      } catch (userError) {
        console.error("Unable to fetch user:", userError)
        setError("Failed to authenticate. Please log in again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return {
    user,
    columns,
    setColumns,
    tasks,
    setTasks,
    loading,
    error,
    isDarkMode,
    setIsDarkMode,
    toggleTheme,
  }
}
