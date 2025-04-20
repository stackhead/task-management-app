"use client"

import { FiX } from "react-icons/fi"
import { useState, useEffect } from "react"
import TaskForm from "./TaskForm"
import { PRIORITY_OPTIONS } from "./Task"

const TaskViewModal = ({ isOpen, onClose, task, onEdit, isDarkMode, columns = [] }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [taskEta, setTaskEta] = useState("")
  const [taskPriority, setTaskPriority] = useState("normal")
  const [taskColumnId, setTaskColumnId] = useState("")

  // Initialize form values when task changes
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title || "")
      setTaskDescription(task.description || "")
      setTaskEta(task.eta || "")
      setTaskPriority(task.priority || "normal")
      setTaskColumnId(task.status || "")
    }
  }, [task])

  if (!isOpen || !task) return null

  // Find priority color and label
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.id === task.priority) || PRIORITY_OPTIONS[2]

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create updated task object
    const updatedTask = {
      ...task,
      title: taskTitle,
      description: taskDescription,
      eta: taskEta,
      priority: taskPriority,
      status: taskColumnId,
    }

    // Call the onEdit function with the updated task
    onEdit(updatedTask)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div
        className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} 
          rounded-lg p-6 w-full md:max-w-md max-w-sm border shadow-lg
          transform transition-all duration-300 animate-scaleIn`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
            {isEditing ? "Edit Task" : task.title}
          </h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
          >
            <FiX size={20} />
          </button>
        </div>

        {isEditing ? (
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
            onSubmit={handleSubmit}
            onClose={() => setIsEditing(false)}
            currentTask={task}
            isDarkMode={isDarkMode}
          />
        ) : (
          <div className="mb-6">
            <div className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-4 whitespace-pre-wrap`}>
              {task.description}
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className={`flex items-center text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                <span>ETA: {task.eta}</span>
              </div>

              <div className="flex items-center">
                <div
                  className="text-sm px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: `${priorityOption.color}20`,
                    color: priorityOption.color,
                  }}
                >
                  {priorityOption.label}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setIsEditing(true)}
                className={`px-4 py-2 ${
                  isDarkMode
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                } rounded-md transition-colors cursor-pointer`}
              >
                Edit Task
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TaskViewModal

