"use client"

import { createContext, useContext } from "react"
import { useKanbanBoard } from "@/hooks/useKanbanBoard"
import { useColumns } from "@/hooks/useColumns"
import { useTasks } from "@/hooks/useTasks"
import { useUIState } from "@/hooks/useUIState"

const KanbanContext = createContext(null)

export function KanbanProvider({ children }) {
  const { user, columns, setColumns, tasks, setTasks, loading, error, isDarkMode, toggleTheme } = useKanbanBoard()

  const {
    isColumnModalOpen,
    setIsColumnModalOpen,
    currentColumn,
    columnName,
    setColumnName,
    columnColor,
    setColumnColor,
    openAddColumnModal,
    openEditColumnModal,
    handleColumnSubmit,
    deleteColumn,
  } = useColumns(columns, setColumns, tasks, setTasks, user)

  const {
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
  } = useTasks(tasks, setTasks, user)

  const { boardHeight, containerRef } = useUIState()

  const value = {
    // Board state
    user,
    columns,
    tasks,
    loading,
    error,
    isDarkMode,
    toggleTheme,

    // Column operations
    isColumnModalOpen,
    setIsColumnModalOpen,
    currentColumn,
    columnName,
    setColumnName,
    columnColor,
    setColumnColor,
    openAddColumnModal,
    openEditColumnModal,
    handleColumnSubmit,
    deleteColumn,

    // Task operations
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

    // UI state
    boardHeight,
    containerRef,
  }

  return <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
}

export function useKanban() {
  const context = useContext(KanbanContext)
  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider")
  }
  return context
}
