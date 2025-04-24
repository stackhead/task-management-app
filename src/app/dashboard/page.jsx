"use client"
import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Client, Account, Databases, ID, Query } from "appwrite"

// Import components
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
import { COLOR_OPTIONS } from "@/components/dashboard/ColorPicker"

// Initialize Appwrite client outside the component
const getAppwriteClient = () => {
  if (typeof window !== 'undefined') {
    const client = new Client()
      .setEndpoint("https://cloud.appwrite.io/v1")
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "")
    
    return {
      account: new Account(client),
      databases: new Databases(client)
    }
  }
  return null
}

// Constants
const DATABASE_ID = process.env.NEXT_PUBLIC_DATABASE_ID || ""
const COLUMNS_COLLECTION_ID = process.env.NEXT_PUBLIC_COLUMNS_COLLECTION_ID || ""
const TASKS_COLLECTION_ID = process.env.NEXT_PUBLIC_TASKS_COLLECTION_ID || ""

function DashboardContent() {
  const [appwrite, setAppwrite] = useState(null)
  const [user, setUser] = useState(null)
  const [columns, setColumns] = useState([])
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [boardHeight, setBoardHeight] = useState("calc(100vh - 180px)")

  // Ref for the container
  const containerRef = useRef(null)

  // Modal states
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isTaskViewModalOpen, setIsTaskViewModalOpen] = useState(false)
  const [currentColumn, setCurrentColumn] = useState(null)
  const [currentTask, setCurrentTask] = useState(null)
  const [viewingTask, setViewingTask] = useState(null)

  // Form states
  const [columnName, setColumnName] = useState("")
  const [columnColor, setColumnColor] = useState(COLOR_OPTIONS[0].value)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskEta, setTaskEta] = useState("")
  const [taskColumnId, setTaskColumnId] = useState("")
  const [taskPriority, setTaskPriority] = useState("normal")

  // Initialize Appwrite client on client-side only
  useEffect(() => {
    setAppwrite(getAppwriteClient())
  }, [])

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

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("kanban-theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
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

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem("kanban-theme", newTheme ? "dark" : "light")
  }

  // Fetch user, columns and tasks
  useEffect(() => {
    const fetchData = async () => {
      if (!appwrite) return

      try {
        setLoading(true)

        // Fetch user
        const loggedInUser = await appwrite.account.get()
        setUser(loggedInUser)

        try {
          // Fetch columns
          const columnsResponse = await appwrite.databases.listDocuments(
            DATABASE_ID, 
            COLUMNS_COLLECTION_ID, 
            [Query.equal("userId", loggedInUser.$id)]
          )

          setColumns(columnsResponse.documents)

          // Fetch tasks
          const tasksResponse = await appwrite.databases.listDocuments(
            DATABASE_ID, 
            TASKS_COLLECTION_ID, 
            [Query.equal("userId", loggedInUser.$id)]
          )

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
  }, [appwrite])

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
    if (!appwrite) return

    try {
      if (currentColumn) {
        // Update existing column
        const updatedColumn = await appwrite.databases.updateDocument(
          DATABASE_ID, 
          COLUMNS_COLLECTION_ID, 
          currentColumn.$id, 
          {
            name: columnName,
            color: columnColor,
          }
        )

        setColumns(columns.map((col) => (col.$id === updatedColumn.$id ? updatedColumn : col)))
      } else {
        // Create new column
        const newColumn = await appwrite.databases.createDocument(
          DATABASE_ID, 
          COLUMNS_COLLECTION_ID, 
          ID.unique(), 
          {
            name: columnName,
            color: columnColor,
            userId: user.$id,
          }
        )

        // Add isNew flag for animation
        const columnWithAnimation = { ...newColumn, _isNew: true }
        setColumns([...columns, columnWithAnimation])
      }

      setIsColumnModalOpen(false)
    } catch (error) {
      console.error("Error saving column:", error)
      alert("The current user is not authorized to perform the requested action log in first.")
    }
  }

  const deleteColumn = async (columnId) => {
    if (!appwrite) return
    if (confirm("Are you sure you want to delete this column? All tasks in this column will be deleted.")) {
      try {
        // Delete the column
        await appwrite.databases.deleteDocument(DATABASE_ID, COLUMNS_COLLECTION_ID, columnId)

        // Update state
        setColumns(columns.filter((col) => col.$id !== columnId))

        // Delete all tasks in this column
        const columnTasks = tasks.filter((task) => task.status === columnId)

        for (const task of columnTasks) {
          await appwrite.databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, task.$id)
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

  const openViewTaskModal = (task) => {
    setViewingTask(task)
    setIsTaskViewModalOpen(true)
  }

  const handleTaskSubmit = async (e) => {
    e.preventDefault()
    if (!appwrite) return

    try {
      if (currentTask) {
        // Update existing task
        const updatedTask = await appwrite.databases.updateDocument(
          DATABASE_ID, 
          TASKS_COLLECTION_ID, 
          currentTask.$id, 
          {
            title: taskTitle,
            description: taskDescription,
            eta: taskEta,
            status: taskColumnId,
            priority: taskPriority,
          }
        )

        setTasks(tasks.map((task) => (task.$id === updatedTask.$id ? updatedTask : task)))
      } else {
        // Create new task
        const newTask = await appwrite.databases.createDocument(
          DATABASE_ID, 
          TASKS_COLLECTION_ID, 
          ID.unique(), 
          {
            title: taskTitle,
            description: taskDescription,
            eta: taskEta,
            status: taskColumnId,
            priority: taskPriority,
            userId: user.$id,
          }
        )

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
    if (!appwrite) return
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        // Delete the task
        await appwrite.databases.deleteDocument(DATABASE_ID, TASKS_COLLECTION_ID, taskId)

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
      if (!appwrite) return
      if (sourceColumnId !== targetColumnId) {
        try {
          // Find the task
          const task = tasks.find((t) => t.$id === taskId)

          if (!task) return

          // Update the task in the database
          const updatedTask = await appwrite.databases.updateDocument(
            DATABASE_ID, 
            TASKS_COLLECTION_ID, 
            taskId, 
            {
              status: targetColumnId,
            }
          )

          // Update state
          setTasks((prevTasks) => prevTasks.map((t) => (t.$id === taskId ? updatedTask : t)))
        } catch (error) {
          console.error("Error moving task:", error)
          // Revert the UI change if the API call fails
          setTasks((prevTasks) => [...prevTasks])
        }
      }
    },
    [tasks, appwrite],
  )

  if (loading) {
    return <LoadingState isDarkMode={isDarkMode} />
  }

  if (error) {
    return <ErrorState error={error} isDarkMode={isDarkMode} />
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <CustomScrollbarStyles isDarkMode={isDarkMode} />

      <div className={`min-h-screen ${isDarkMode ? "bg-[#0D1117]" : "bg-gray-50"}`}>
        <Navbar user={user} isDarkMode={isDarkMode} />

        <div className="md:p-6 p-4" ref={containerRef}>
          <Header toggleTheme={toggleTheme} openAddColumnModal={openAddColumnModal} isDarkMode={isDarkMode} />

          {columns.length === 0 ? (
            <EmptyState openAddColumnModal={openAddColumnModal} isDarkMode={isDarkMode} />
          ) : (
            <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide" style={{ height: boardHeight }}>
              {columns.map((column) => (
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
                  isDarkMode={isDarkMode}
                  isNew={column._isNew} // Pass isNew flag to column
                />
              ))}
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
export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <DashboardContent />
    </Suspense>
  )
}
