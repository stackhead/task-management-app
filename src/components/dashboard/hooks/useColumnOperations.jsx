"use client"

import { useState } from "react"
import { databases, ID, DATABASE_ID, COLUMNS_COLLECTION_ID, TASKS_COLLECTION_ID } from "@/components/services/appwrite"
import { COLOR_OPTIONS } from "@/components/dashboard/ColorPicker"

export function useColumnOperations({ user, columns, setColumns, tasks, setTasks, isDarkMode }) {
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [currentColumn, setCurrentColumn] = useState(null)
  const [columnName, setColumnName] = useState("")
  const [columnColor, setColumnColor] = useState(COLOR_OPTIONS[0].value)

  const openAddColumnModal = () => {
    setColumnName("")
    setColumnColor(COLOR_OPTIONS[0].value)
    setCurrentColumn(null)
    setIsColumnModalOpen(true)
  }

  const openEditColumnModal = (column) => {
    setColumnName(column.name)
    setColumnColor(column.color || COLOR_OPTIONS[0].value)
    setCurrentColumn(column)
    setIsColumnModalOpen(true)
  }

  const handleColumnSubmit = async (e) => {
    e.preventDefault()

    try {
      if (currentColumn) {
        // Update existing column
        const updatedColumn = await databases.updateDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, currentColumn.$id, {
          name: columnName,
          color: columnColor,
        })

        setColumns(columns.map((col) => (col.$id === updatedColumn.$id ? updatedColumn : col)))
      } else {
        // Create new column
        const newColumn = await databases.createDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, ID.unique(), {
          name: columnName,
          color: columnColor,
          userId: user.$id,
        })

        // Add isNew flag for animation
        const columnWithAnimation = { ...newColumn, _isNew: true }
        setColumns([...columns, columnWithAnimation])
      }

      setIsColumnModalOpen(false)
    } catch (error) {
      console.error("Error saving column:", error)
      alert("Failed to save column. Please try again.")
    }
  }

  const deleteColumn = async (columnId) => {
    // Create a custom confirm dialog instead of using the browser's default
    const confirmDelete = () => {
      return new Promise((resolve) => {
        // Create modal container
        const modalContainer = document.createElement("div")
        modalContainer.className = `fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isDarkMode ? "bg-black/70" : "bg-black/50"
        }`

        // Find the column and its tasks
        const columnToDelete = columns.find((col) => col.$id === columnId)
        const columnTasks = tasks.filter((task) => task.status === columnId)

        // Create modal content
        const modalContent = document.createElement("div")
        modalContent.className = `w-full max-w-md rounded-lg p-6 ${isDarkMode ? "bg-[#161B22]" : "bg-white"} shadow-xl`
        modalContent.innerHTML = `
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}">
              Delete Column
            </h3>
            <button class="p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${isDarkMode ? "text-gray-400" : "text-gray-500"}">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p class="mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}">
            Are you sure you want to delete the "${columnToDelete?.name}" column?
            ${columnTasks.length > 0 ? ` This will also delete ${columnTasks.length} task(s) in this column.` : ""}
          </p>
          <div class="flex justify-end space-x-3">
            <button id="cancel-btn" class="px-4 py-2 rounded-md ${
              isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"
            }">
              Cancel
            </button>
            <button id="confirm-btn" class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors">
              Delete Column
            </button>
          </div>
        `

        modalContainer.appendChild(modalContent)
        document.body.appendChild(modalContainer)

        // Add event listeners
        const cancelBtn = modalContent.querySelector("#cancel-btn")
        const confirmBtn = modalContent.querySelector("#confirm-btn")
        const closeBtn = modalContent.querySelector("button")

        cancelBtn.addEventListener("click", () => {
          document.body.removeChild(modalContainer)
          resolve(false)
        })

        confirmBtn.addEventListener("click", () => {
          document.body.removeChild(modalContainer)
          resolve(true)
        })

        closeBtn.addEventListener("click", () => {
          document.body.removeChild(modalContainer)
          resolve(false)
        })

        // Close on backdrop click
        modalContainer.addEventListener("click", (e) => {
          if (e.target === modalContainer) {
            document.body.removeChild(modalContainer)
            resolve(false)
          }
        })
      })
    }

    const confirmed = await confirmDelete()

    if (confirmed) {
      try {
        // Delete the column
        await databases.deleteDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, columnId)

        // Update state
        setColumns(columns.filter((col) => col.$id !== columnId))

        // Delete all tasks in this column
        const columnTasks = tasks.filter((task) => task.status === columnId)

        for (const task of columnTasks) {
          await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, task.$id)
        }

        setTasks(tasks.filter((task) => task.status !== columnId))
      } catch (error) {
        console.error("Error deleting column:", error)
        alert("Failed to delete column. Please try again.")
      }
    }
  }

  return {
    isColumnModalOpen,
    setIsColumnModalOpen,
    currentColumn,
    setCurrentColumn,
    columnName,
    setColumnName,
    columnColor,
    setColumnColor,
    openAddColumnModal,
    openEditColumnModal,
    handleColumnSubmit,
    deleteColumn,
  }
}
