"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

// Import refactored components
import Column from "@/components/dashboard/Column"
import Modal from "@/components/dashboard/Modal"
import TaskViewModal from "@/components/dashboard/TaskViewModal"
import ColumnForm from "@/components/dashboard/ColumnForm"
import TaskForm from "@/components/dashboard/TaskForm"
import LoadingState from "@/components/dashboard/LoadingState"
import ErrorState from "@/components/dashboard/ErrorState"
import EmptyState from "@/components/dashboard/EmptyState"
import CustomScrollbarStyles from "@/components/dashboard/CustomScrollbarStyles"
import Navbar from "@/components/dashboard/Navbar"
import Header from "@/components/dashboard/Header"
import AddColumnButton from "@/components/dashboard/AddColumnButton"
import { useBoardState } from "@/components/dashboard/hooks/useBoardState"
import { useColumnOperations } from "@/components/dashboard/hooks/useColumnOperations"
import { useTaskOperations } from "@/components/dashboard/hooks/useTaskOperations"

export default function DashboardPage() {
  // Use our custom hooks
  const { user, columns, setColumns, tasks, setTasks, loading, error, isDarkMode, setIsDarkMode, toggleTheme } =
    useBoardState()

  const {
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
  } = useColumnOperations({ user, columns, setColumns, tasks, setTasks, isDarkMode })

  const {
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
  } = useTaskOperations({ user, tasks, setTasks, isDarkMode })

  // Ref for the container and board height calculation
  const containerRef = useRef(null)
  const [boardHeight, setBoardHeight] = useState("calc(100vh - 170px)")

  // Column reordering function
  const moveColumn = useCallback(
    (fromIndex, toIndex) => {
      const updatedColumns = [...columns]
      const [movedColumn] = updatedColumns.splice(fromIndex, 1)
      updatedColumns.splice(toIndex, 0, movedColumn)
      setColumns(updatedColumns)
    },
    [columns, setColumns],
  )

  // Calculate board height on mount and window resize
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const navHeight = document.querySelector("nav")?.offsetHeight || 0
        const headerHeight = 120 // Approximate header height
        const windowHeight = window.innerHeight
        const newHeight = windowHeight - navHeight - headerHeight - 50 // 50px buffer
        setBoardHeight(`${newHeight}px`)
      }
    }

    calculateHeight()
    window.addEventListener("resize", calculateHeight)

    return () => {
      window.removeEventListener("resize", calculateHeight)
    }
  }, [])

  // Add animation keyframes to the document
  useEffect(() => {
    // Add keyframes for animations if they don't exist
    if (!document.getElementById("kanban-animations")) {
      const style = document.createElement("style")
      style.id = "kanban-animations"
      style.innerHTML = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-in-out 3;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  if (loading) {
    return <LoadingState isDarkMode={isDarkMode} />
  }

  if (error) {
    return <ErrorState error={error} isDarkMode={isDarkMode} />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomScrollbarStyles isDarkMode={isDarkMode} />

      <div className={`min-h-screen ${isDarkMode ? "bg-[#0D1117]" : "bg-gradient-to-br from-indigo-50 to-blue-50"}`}>
        <Navbar user={user} isDarkMode={isDarkMode} />

        <div className="" ref={containerRef}>
          <Header toggleTheme={toggleTheme} isDarkMode={isDarkMode} />

          {columns.length === 0 ? (
            <EmptyState openAddColumnModal={openAddColumnModal} isDarkMode={isDarkMode} />
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 px-3 scrollbar-hide" style={{ height: boardHeight }}>
              {columns.map((column, index) => (
                <Column
                  key={column.$id}
                  column={column}
                  tasks={tasks}
                  onAddTask={openAddTaskModal}
                  onDeleteTask={deleteTask}
                  onEditTask={openEditTaskModal}
                  onViewTask={openViewTaskModal}
                  onDeleteColumn={deleteColumn}
                  onEditColumn={openEditColumnModal}
                  moveTask={moveTask}
                  moveColumn={moveColumn} // Pass column reordering function
                  index={index} // Pass column index
                  isDarkMode={isDarkMode}
                  isNew={column._isNew}
                />
              ))}

              {/* Add Column Button - positioned after all columns */}
              <AddColumnButton onClick={openAddColumnModal} isDarkMode={isDarkMode} />
            </div>
          )}
        </div>

        {/* Column Modal */}
        <Modal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          title={currentColumn ? `Edit Column` : "Add Column"}
          isDarkMode={isDarkMode}
        >
          <ColumnForm
            columnName={columnName}
            setColumnName={setColumnName}
            columnColor={columnColor}
            setColumnColor={setColumnColor}
            onSubmit={handleColumnSubmit}
            onClose={() => setIsColumnModalOpen(false)}
            currentColumn={currentColumn}
            isDarkMode={isDarkMode}
          />
        </Modal>

        {/* Task Modal */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title={currentTask ? "Edit Task" : "Add Task"}
          isDarkMode={isDarkMode}
        >
          <TaskForm
            taskTitle={taskTitle}
            setTaskTitle={setTaskTitle}
            taskDescription={taskDescription}
            setTaskDescription={setTaskDescription}
            taskEta={taskEta}
            setTaskEta={setTaskEta}
            taskPriority={taskPriority}
            setTaskPriority={setTaskPriority}
            taskColumnId={taskColumnId}
            setTaskColumnId={setTaskColumnId}
            columns={columns}
            onSubmit={handleTaskSubmit}
            onClose={() => setIsTaskModalOpen(false)}
            currentTask={currentTask}
            isDarkMode={isDarkMode}
          />
        </Modal>

        {/* Task View Modal */}
        <TaskViewModal
          isOpen={isTaskViewModalOpen}
          onClose={() => setIsTaskViewModalOpen(false)}
          task={viewingTask}
          onEdit={openEditTaskModal}
          isDarkMode={isDarkMode}
          columns={columns}
        />
      </div>
    </DndProvider>
  )
}
