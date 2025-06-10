"use client"

import { FiX, FiEdit3, FiCalendar, FiFlag, FiAlignLeft } from "react-icons/fi"
import { useState, useEffect } from "react"
import { PRIORITY_OPTIONS } from "./Task"

const TaskViewModal = ({ isOpen, onClose, task, onEdit, isDarkMode, columns = [] }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isSliding, setIsSliding] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsSliding(true)
    }
  }, [isOpen])

  const handleClose = () => {
    setIsSliding(false)
    setTimeout(() => {
      onClose()
      setIsEditing(false)
    }, 300)
  }

  const handleEdit = () => {
    setIsEditing(false)
    onEdit(task)
    handleClose()
  }

  if (!isOpen || !task) return null

  const priorityOption = PRIORITY_OPTIONS.find((p) => p.id === task.priority) || PRIORITY_OPTIONS[2]
  const currentColumn = columns.find((col) => col.$id === task.status)

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No due date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/10 transition-opacity duration-300 z-40 ${
          isSliding ? "bg-opacity-50" : "bg-opacity-0"
        }`}
        onClick={handleClose}
      />

      {/* Slide-in Panel */}
      <div
        className={`overflow-auto fixed top-0 right-0 h-full w-full max-w-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isSliding ? "translate-x-0" : "translate-x-full"
        } ${isDarkMode ? "bg-[#0D1117]" : "bg-white"} shadow-2xl`}
      >
        {/* Header */}
        <div
          className={`sticky top-0 z-10 px-6 py-4 border-b ${
            isDarkMode ? "border-gray-700 bg-[#161B22]" : "border-gray-200 bg-gray-50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentColumn?.color || "#6B7280" }} />
              <h2 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                Task Details
              </h2>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
                title="Edit task"
              >
                <FiEdit3 size={18} />
              </button>
              <button
                onClick={handleClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "text-gray-400 hover:text-gray-200 hover:bg-gray-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <FiX size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Title */}
          <div>
            <h1 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"} leading-tight`}>
              {task.title}
            </h1>
          </div>

          {/* Status and Priority */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  isDarkMode ? "bg-gray-700 text-gray-200" : "bg-gray-100 text-gray-800"
                }`}
                style={{
                  backgroundColor: currentColumn?.color ? `${currentColumn.color}20` : undefined,
                  color: currentColumn?.color || undefined,
                }}
              >
                {currentColumn?.name || "Unknown"}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <FiFlag size={16} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${priorityOption.color}20`,
                  color: priorityOption.color,
                }}
              >
                {priorityOption.label}
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center space-x-3">
            <FiCalendar size={18} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
            <div>
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Due Date:</span>
              <p className={`text-base ${isDarkMode ? "text-gray-200" : "text-gray-800"}`}>{formatDate(task.eta)}</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <FiAlignLeft size={18} className={isDarkMode ? "text-gray-400" : "text-gray-600"} />
              <span className={`text-sm font-medium ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                Description:
              </span>
            </div>
            <div
              className={`p-4 rounded-lg ${
                isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
              }`}
            >
              <p
                className={`text-base overflow-auto leading-relaxed whitespace-pre-wrap ${
                  isDarkMode ? "text-gray-200" : "text-gray-700"
                }`}
              >
                {task.description || "No description provided."}
              </p>
            </div>
          </div>

          {/* Metadata */}
          <div
            className={`p-4 rounded-lg ${
              isDarkMode ? "bg-gray-800 border border-gray-700" : "bg-gray-50 border border-gray-200"
            }`}
          >
            <h3 className={`text-sm font-medium mb-3 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              Task Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Created:</span>
                <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                  {new Date(task.$createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Last Updated:</span>
                <span className={isDarkMode ? "text-gray-200" : "text-gray-800"}>
                  {new Date(task.$updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={`sticky bottom-0 px-6 py-4 border-t ${
            isDarkMode ? "border-gray-700 bg-[#161B22]" : "border-gray-200 bg-gray-50"
          }`}
        >
          <button
            onClick={handleEdit}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
              isDarkMode ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600/70 hover:bg-blue-700 text-white"
            }`}
          >
            Edit Task
          </button>
        </div>
      </div>
    </>
  )
}

export default TaskViewModal
