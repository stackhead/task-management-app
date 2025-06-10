"use client"

import { useState, useCallback } from "react"
import { databases, ID, DATABASE_ID, TASKS_COLLECTION_ID } from "@/components/services/appwrite"
import { confirmDialog } from "@/utils/confirmDialog"

export function useTasks(tasks, setTasks, user, isDarkMode) {
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

  // Replace the deleteTask function with this:
  const deleteTask = async (taskId) => {
    const taskToDelete = tasks.find((task) => task.$id === taskId)
    const confirmed = await confirmDialog(
      `Are you sure you want to delete the "${taskToDelete?.title}" task?`,
      "Delete Task",
      isDarkMode,
    )

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
    viewingTask,
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
