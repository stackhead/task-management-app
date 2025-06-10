"use client"

import { confirmDialog } from "@/utils/confirmDialog"
import { databases, DATABASE_ID, COLUMNS_COLLECTION_ID, TASKS_COLLECTION_ID } from "@/utils/database"
import { useColumns, useTasks } from "@/hooks/useColumns"
import { useState } from "react"

const useColumnOperations = () => {
  const [columns, setColumns] = useColumns()
  const [tasks, setTasks] = useTasks()
  const [isDarkMode, setIsDarkMode] = useState(false)

  const deleteColumn = async (columnId) => {
    const columnToDelete = columns.find((col) => col.$id === columnId)
    const columnTasks = tasks.filter((task) => task.status === columnId)
    const confirmed = await confirmDialog(
      `Are you sure you want to delete the "${columnToDelete?.name}" column? ${
        columnTasks.length > 0 ? `This will also delete ${columnTasks.length} task(s) in this column.` : ""
      }`,
      "Delete Column",
      isDarkMode,
    )

    if (confirmed) {
      try {
        // Delete the column
        await databases.deleteDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, columnId)

        // Update state
        setColumns(columns.filter((col) => col.$id !== columnId))

        // Delete all tasks in this column
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
    deleteColumn,
    columns,
    setColumns,
    tasks,
    setTasks,
    isDarkMode,
    setIsDarkMode,
  }
}

export default useColumnOperations
