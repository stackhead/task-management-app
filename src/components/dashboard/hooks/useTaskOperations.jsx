"use client"

import { useState, useCallback } from "react"
import { databases, ID, DATABASE_ID, TASKS_COLLECTION_ID } from "@/components/services/appwrite"

export function useTaskOperations({ user, tasks, setTasks, isDarkMode }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isTaskViewModalOpen, setIsTaskViewModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskEta, setTaskEta] = useState("")
  const [taskColumnId, setTaskColumnId] = useState("")
  const [taskPriority, setTaskPriority] = useState("normal")

  const openAddTaskModal = (columnId) => {
    setTaskTitle("")
    setTaskDescription("")
    setTaskEta("")
    setTaskColumnId(columnId)
    setTaskPriority("normal")
    setCurrentTask(null)
    setIsTaskModalOpen(true)
  }

  const openEditTaskModal = (task) => {
    setTaskTitle(task.title)
    setTaskDescription(task.description)
    setTaskEta(task.eta)
    setTaskColumnId(task.status)
    setTaskPriority(task.priority || "normal")
    setCurrentTask(task)
    setIsTaskModalOpen(true)
  }

  const openViewTaskModal = (task) => {
    setViewingTask(task)
    setIsTaskViewModalOpen(true)
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()

    try {
      if (currentTask) {
        // Update existing task
        const updatedTask = await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, currentTask.$id, {
          title: taskTitle,
          description: taskDescription,
          eta: taskEta,
          status: taskColumnId,
          priority: taskPriority,
        })

        setTasks(tasks.map((task) => (task.$id === updatedTask.$id ? updatedTask : task)))
      } else {
        // Create new task
        const newTask = await databases.createDocument(DATABASE_ID, TASKS_COLLECTION_ID, ID.unique(), {
          title: taskTitle,
          description: taskDescription,
          eta: taskEta,
          status: taskColumnId,
          priority: taskPriority,
          userId: user.$id,
        })

        // Add isNew flag for animation
        const taskWithAnimation = { ...newTask, _isNew: true }
        setTasks([...tasks, taskWithAnimation])
      }

      setIsTaskModalOpen(false)
    } catch (error) {
      console.error("Error saving task:", error)
      alert("Failed to save task. Please try again.")
    }
  }

  const deleteTask = async (taskId) => {
    // Create a custom confirm dialog instead of using the browser's default
    const confirmDelete = () => {
      return new Promise((resolve) => {
        // Create modal container
        const modalContainer = document.createElement("div")
        modalContainer.className = `fixed inset-0 z-50 flex items-center justify-center p-4 ${
          isDarkMode ? "bg-black/70" : "bg-black/50"
        }`

        // Find the task
        const taskToDelete = tasks.find((task) => task.$id === taskId)

        // Create modal content
        const modalContent = document.createElement("div")
        modalContent.className = `w-full max-w-md rounded-lg p-6 ${isDarkMode ? "bg-[#161B22]" : "bg-white"} shadow-xl`
        modalContent.innerHTML = `
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}">
              Delete Task
            </h3>
            <button class="p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${isDarkMode ? "text-gray-400" : "text-gray-500"}">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <p class="mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}">
            Are you sure you want to delete the "${taskToDelete?.title}" task?
          </p>
          <div class="flex justify-end space-x-3">
            <button id="cancel-btn" class="px-4 py-2 rounded-md ${
              isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"
            }">
              Cancel
            </button>
            <button id="confirm-btn" class="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors">
              Delete Task
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
        // Delete the task
        await databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId)

        // Update state
        setTasks(tasks.filter((task) => task.$id !== taskId))
      } catch (error) {
        console.error("Error deleting task:", error)
        alert("Failed to delete task. Please try again.")
      }
    }
  }

  const moveTask = useCallback(
    async (taskId, sourceColumnId, targetColumnId) => {
      if (sourceColumnId !== targetColumnId) {
        try {
          // Find the task
          const task = tasks.find((t) => t.$id === taskId)

          if (!task) return

          // Update the task in the database
          const updatedTask = await databases.updateDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId, {
            status: targetColumnId,
          })

          // Update state
          setTasks((prevTasks) => prevTasks.map((t) => (t.$id === taskId ? updatedTask : t)))
        } catch (error) {
          console.error("Error moving task:", error)
          // Revert the UI change if the API call fails
          setTasks((prevTasks) => [...prevTasks])
        }
      }
    },
    [tasks, setTasks],
  )

  return {
    isTaskModalOpen,
    setIsTaskModalOpen,
    isTaskViewModalOpen,
    setIsTaskViewModalOpen,
    currentTask,
    setCurrentTask,
    viewingTask,
    setViewingTask,
    taskTitle,
    setTaskTitle,
    taskDescription,
    setTaskDescription,
    taskEta,
    setTaskEta,
    taskColumnId,
    setTaskColumnId,
    taskPriority,
    setTaskPriority,
    openAddTaskModal,
    openEditTaskModal,
    openViewTaskModal,
    handleTaskSubmit,
    deleteTask,
    moveTask,
  }
}
