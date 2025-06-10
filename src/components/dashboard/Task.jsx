"use client"

import { useDrag } from "react-dnd"
import { FiEdit2, FiTrash2, FiEye, FiClock, FiFlag } from "react-icons/fi"
import { useState, useEffect } from "react"

export const PRIORITY_OPTIONS = [
  { id: "urgent", label: "Urgent", color: "#EF4444" },
  { id: "high", label: "High", color: "#F97316" },
  { id: "normal", label: "Normal", color: "#10B981" },
  { id: "low", label: "Low", color: "#6B7280" },
]

const Task = ({ task, onDelete, onEdit, onView, moveTask, isDarkMode, isNew = false }) => {
  const [animate, setAnimate] = useState(isNew)

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.$id, sourceColumnId: task.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    options: {
      dropEffect: "move",
    },
  })

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  const priorityOption = PRIORITY_OPTIONS.find((p) => p.id === task.priority) || PRIORITY_OPTIONS[2]

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = date.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays < 0) return "Overdue"
    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    return `${diffDays} days`
  }

  return (
    <div
      ref={drag}
      className={`p-3 rounded-lg cursor-pointer transition-all duration-200 select-none ${
        isDragging ? "opacity-50 rotate-2 scale-105" : "opacity-100"
      } ${animate ? "animate-pulse" : ""} ${
        isDarkMode
          ? "bg-[#1F2937] border border-gray-700 hover:bg-[#374151] shadow-sm"
          : "bg-white border border-gray-200 hover:bg-gray-50 shadow-sm"
      }`}
      style={{
        transform: isDragging ? "rotate(2deg) scale(1.05)" : "none",
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
      onMouseDown={(e) => {
        // Only prevent default for left mouse button to allow drag
        if (e.button === 0) {
          e.preventDefault()
        }
      }}
      draggable="false"
    >
      <div className="flex justify-between items-start mb-2">
        <h3
          className={`font-medium text-sm ${isDarkMode ? "text-gray-100" : "text-gray-800"} line-clamp-2 select-none`}
          draggable="false"
        >
          {task.title}
        </h3>
        <div className="flex space-x-1 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView(task)
            }}
            className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            aria-label="View task"
          >
            <FiEye size={12} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}
            className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            aria-label="Edit task"
          >
            <FiEdit2 size={12} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.$id)
            }}
            className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
            aria-label="Delete task"
          >
            <FiTrash2 size={12} className={isDarkMode ? "text-red-400" : "text-red-500"} />
          </button>
        </div>
      </div>

      {task.description && (
        <p
          className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2 line-clamp-2 select-none`}
          draggable="false"
        >
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {task.eta && (
            <div className={`flex items-center text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"} select-none`}>
              <FiClock size={10} className="mr-1" />
              <span draggable="false">{formatDate(task.eta)}</span>
            </div>
          )}
        </div>

        <div className="flex items-center">
          <div
            className="text-xs px-2 py-1 rounded-full flex items-center select-none"
            style={{
              backgroundColor: `${priorityOption.color}20`,
              color: priorityOption.color,
            }}
            draggable="false"
          >
            <FiFlag size={10} className="mr-1" />
            <span draggable="false">{priorityOption.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Task
