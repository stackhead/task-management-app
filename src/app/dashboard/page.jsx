"use client"

import { useEffect, useState, useCallback } from "react"
import {
  account,
  databases,
  ID,
  DATABASE_ID,
  COLUMNS_COLLECTION_ID,
  TASKS_COLLECTION_ID,
  Query,
} from "@/components/services/appwrite"
import LogoutButton from "@/components/dashboard/LogoutButton"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { FiPlus, FiTrash2, FiEdit2, FiX, FiClock, FiAlignLeft, FiFlag, FiLoader, FiMoon } from "react-icons/fi"
import { LuSunMedium } from "react-icons/lu";


// Color options for columns
const COLOR_OPTIONS = [
  { id: "gray", value: "#6B7280" },
  { id: "blue", value: "#3B82F6" },
  { id: "green", value: "#10B981" },
  { id: "yellow", value: "#F59E0B" },
  { id: "orange", value: "#F97316" },
  { id: "red", value: "#EF4444" },
  { id: "purple", value: "#8B5CF6" },
  { id: "pink", value: "#EC4899" },
]

// Priority options for tasks
const PRIORITY_OPTIONS = [
  { id: "urgent", label: "Urgent", color: "#EF4444" },
  { id: "high", label: "High", color: "#F97316" },
  { id: "normal", label: "Normal", color: "#3B82F6" },
  { id: "low", label: "Low", color: "#10B981" },
]

// Task component with drag functionality
const Task = ({ task, onDelete, onEdit, moveTask, isDarkMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.$id, sourceColumnId: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // Find priority color
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.id === task.priority) || PRIORITY_OPTIONS[2]

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 ${isDarkMode ? "bg-[#151B23] border-gray-700" : "bg-white border-gray-200"} rounded-md shadow border ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
      style={{ cursor: "move" }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{task.title}</h3>
        <div className="flex space-x-1">
          <button
            onClick={() => onEdit(task)}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(task.$id)}
            className={`${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"} cursor-pointer`}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2`}>{task.description}</p>
      <div className="flex items-center justify-between">
        <div className={`flex items-center text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          <FiClock className="mr-1" size={12} />
          <span>ETA: {task.eta}</span>
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: `${priorityOption.color}20`,
            color: priorityOption.color,
          }}
        >
          {priorityOption.label}
        </div>
      </div>
    </div>
  )
}

// Column component with drop functionality
const Column = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onDeleteColumn,
  onEditColumn,
  moveTask,
  isDarkMode,
}) => {
  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item) => {
      moveTask(item.id, item.sourceColumnId, column.$id)
      return { moved: true }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  // Filter tasks that belong to this column
  const columnTasks = tasks.filter((task) => task.status === column.$id)

  return (
    <div
      className={`w-72 flex-shrink-0 ${isDarkMode ? "bg-[#010409]" : "bg-gray-100"} rounded-md ${isOver ? "bg-opacity-80" : ""}`}
      style={{ height: "calc(100vh - 180px)", display: "flex", flexDirection: "column" }}
    >
      <div className={`p-3 ${isDarkMode ? "border-gray-700" : "border-gray-200"} border-b flex items-center space-x-2`}>
        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: column.color || "#6B7280" }} />
        <div className="flex items-center flex-1">
          <h2 className={`font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{column.name}</h2>
          <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600"}`}
          >
            {columnTasks.length}
          </span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => onEditColumn(column)}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
          >
            <FiEdit2 size={16} />
          </button>
          <button
            onClick={() => onDeleteColumn(column.$id)}
            className={`${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"} cursor-pointer`}
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>

      <div
        ref={drop}
        className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar"
        style={{
          "--scrollbar-thumb": isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
          "--scrollbar-track": isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
        }}
      >
        {columnTasks.map((task) => (
          <Task
            key={task.$id}
            task={task}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            moveTask={moveTask}
            isDarkMode={isDarkMode}
          />
        ))}
      </div>

      <div className={`p-3 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => onAddTask(column.$id)}
          className={`w-full py-2 flex items-center justify-center text-sm ${
            isDarkMode ? "text-gray-300 bg-gray-950 hover:bg-gray-700" : "text-gray-700 bg-white hover:bg-gray-200"
          } rounded transition-colors cursor-pointer`}
        >
          <FiPlus size={16} className="mr-1" /> Add Task
        </button>
      </div>
    </div>
  )
}

// Modal component for forms
const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} rounded-lg p-6 w-full md:max-w-md max-w-sm border`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
          >
            <FiX size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

// Color Picker Component
const ColorPicker = ({ selectedColor, onColorSelect }) => {
  return (
    <div className="flex space-x-2">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color.id}
          type="button"
          className={`w-6 h-6 rounded-full cursor-pointer ${
            selectedColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
          }`}
          style={{ backgroundColor: color.value }}
          onClick={() => onColorSelect(color.value)}
        />
      ))}
    </div>
  )
}

export default function DashboardPage() {
  const [user, setUser] = useState(null)
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Modal states
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [currentColumn, setCurrentColumn] = useState(null)
  const [currentTask, setCurrentTask] = useState(null)

  // Form states
  const [columnName, setColumnName] = useState("")
  const [columnColor, setColumnColor] = useState(COLOR_OPTIONS[0].value)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskEta, setTaskEta] = useState("")
  const [taskColumnId, setTaskColumnId] = useState("")
  const [taskPriority, setTaskPriority] = useState("normal")

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
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

  // Column functions
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

        setColumns([...columns, newColumn])
      }

      setIsColumnModalOpen(false)
    } catch (error) {
      console.error("Error saving column:", error)
      alert("The current user is not authorized to perform the requested action log in first.")
    }
  }

  const deleteColumn = async (columnId) => {
    if (confirm("Are you sure you want to delete this column? All tasks in this column will be deleted.")) {
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

  // Task functions
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

        setTasks([...tasks, newTask])
      }

      setIsTaskModalOpen(false)
    } catch (error) {
      console.error("Error saving task:", error)
      alert("Failed to save task. Please try again.")
    }
  }

  const deleteTask = async (taskId) => {
    if (confirm("Are you sure you want to delete this task?")) {
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
    [tasks],
  )

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center`}>
        <div className="text-center">
          <FiLoader
            className={`animate-spin h-10 w-10 ${isDarkMode ? "text-gray-400" : "text-gray-500"} mx-auto mb-4`}
          />
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Loading your board please wait...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gray-50"} flex items-center justify-center`}>
        <div className={`text-center p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-lg max-w-md shadow-lg`}>
          <div className="text-red-500 text-5xl mb-4">!</div>
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"} mb-2`}>
            Something went wrong
          </h2>
          <p className={isDarkMode ? "text-gray-400" : "text-gray-600"} mb-4>
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-4 py-2 ${
              isDarkMode ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } rounded-md transition-colors cursor-pointer`}
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: thin;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 20px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 4px;
          transition: background-color 0.2s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"};
        }

        /* Firefox scrollbar styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
        }

        /* Add cursor pointer to all buttons and clickable elements */
        button, 
        [role="button"],
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>

      <div className={`min-h-screen ${isDarkMode ? "bg-[#0D1117]" : "bg-gray-50"}`}>
        <nav
          className={`flex justify-between items-center p-3 md:p-4 sticky top-0 left-0 right-0 ${
            isDarkMode ? "bg-[#010409] border-gray-800" : "bg-white border-gray-200"
          } backdrop-blur-3xl border-b shadow-md z-10`}
        >
          <h1 className={`text-[20px] font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            {user ? `Welcome, ${user.name} : )` : "Loading..."}
          </h1>
          <LogoutButton />
        </nav>

        <div className="md:p-6 p-4">
          <div className="flex justify-between items-center mb-2">
            <h2
              className={`md:text-[25px] max-md:text-[20px] font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
            >
              Task Management
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md ${
                  isDarkMode
                    ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition-colors cursor-pointer`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <LuSunMedium size={18} /> : <FiMoon size={18} />}
              </button>
              <button
                onClick={openAddColumnModal}
                className={`md:px-4 px-2 md:py-2 max-md:py-[5px] ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                } rounded-md flex items-center transition-colors cursor-pointer`}
              >
                <FiPlus size={16} className="mr-1" /> Add Column
              </button>
            </div>
          </div>
          <h2
            className={`md:text-sm max-md:text-[13px] font-light md:w-[40%] ${isDarkMode ? "text-gray-100" : "text-gray-600"} mb-6`}
          >
            Streamline your workflow with an intuitive Kanban board designed for seamless task management.
          </h2>

          {columns.length === 0 ? (
            <div
              className={`flex items-center justify-center h-[calc(100vh-250px)] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <div className="text-center">
                <p className="mb-4">No columns yet. Start by creating your first column!</p>
                <button
                  onClick={openAddColumnModal}
                  className={`px-4 py-2 ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                      : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  } rounded-md flex items-center transition-colors cursor-pointer mx-auto`}
                >
                  <FiPlus size={16} className="mr-1" /> Add Column
                </button>
              </div>
            </div>
          ) : (
            <div className="flex space-x-4 max-md:overflow-x-auto pb-4 h-screen scrollbar-hide">
              {columns.map((column) => (
                <Column
                  key={column.$id}
                  column={column}
                  tasks={tasks}
                  onAddTask={openAddTaskModal}
                  onDeleteTask={deleteTask}
                  onEditTask={openEditTaskModal}
                  onDeleteColumn={deleteColumn}
                  onEditColumn={openEditColumnModal}
                  moveTask={moveTask}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          )}
        </div>

        {/* Column Modal */}
        <Modal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          title={
            currentColumn
              ? `Edit Column`
              : "Add Column"
          }
          isDarkMode={isDarkMode}
        >
          <form onSubmit={handleColumnSubmit}>
            <div className="mb-2 md:mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Color
              </label>
              <ColorPicker selectedColor={columnColor} onColorSelect={setColumnColor} />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Column Name
              </label>
              <input
                type="text"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                className={`w-full px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600`}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsColumnModalOpen(false)}
                className={`mr-2 px-4 py-2 ${
                  isDarkMode
                    ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                    : "text-gray-600 bg-gray-200 hover:bg-gray-300"
                } rounded-md transition-colors cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${
                  isDarkMode
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                } rounded-md transition-colors cursor-pointer`}
              >
                {currentColumn ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>

        {/* Task Modal */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          title={currentTask ? "Edit Task" : "Add Task"}
          isDarkMode={isDarkMode}
        >
          <form onSubmit={handleTaskSubmit}>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Title
              </label>
              <input
                type="text"
                 placeholder="e.g. Lorem ipsum"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className={`w-full px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600`}
                required
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                <div className="flex items-center">
                  <FiAlignLeft size={14} className="mr-1" /> Description
                </div>
              </label>
              <textarea
                value={taskDescription}
                maxLength={1000} 
                placeholder="e.g. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
                onChange={(e) => setTaskDescription(e.target.value)}
                className={`w-full px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600`}
                rows="3"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                <div className="flex items-center">
                  <FiClock size={14} className="mr-1" /> ETA
                </div>
              </label>
              <input
                type="text"
                value={taskEta}
                onChange={(e) => setTaskEta(e.target.value)}
                placeholder="e.g. 2 days, 3 hours"
                className={`w-full px-3 py-2 ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
                    : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600`}
                required
              />
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                <div className="flex items-center">
                  <FiFlag size={14} className="mr-1" /> Priority
                </div>
              </label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value)}
                className={`w-full px-3 py-2 ${
                  isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-800"
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer`}
                required
              >
                {PRIORITY_OPTIONS.map((priority) => (
                  <option key={priority.id} value={priority.id}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
                Status
              </label>
              <select
                value={taskColumnId}
                onChange={(e) => setTaskColumnId(e.target.value)}
                className={`w-full px-3 py-2 ${
                  isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-800"
                } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600 cursor-pointer`}
                required
              >
                {columns.map((column) => (
                  <option key={column.$id} value={column.$id}>
                    {column.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsTaskModalOpen(false)}
                className={`mr-2 px-4 py-2 ${
                  isDarkMode
                    ? "text-gray-300 bg-gray-800 hover:bg-gray-700"
                    : "text-gray-600 bg-gray-200 hover:bg-gray-300"
                } rounded-md transition-colors cursor-pointer`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 ${
                  isDarkMode
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                } rounded-md transition-colors cursor-pointer`}
              >
                {currentTask ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </DndProvider>
  )
}

