"use client"

import { FiEdit2, FiTrash2, FiClock } from "react-icons/fi"
import { useDrag } from "react-dnd"
import { useEffect, useState } from "react"

// Priority options for tasks
const PRIORITY_OPTIONS = [
  { id: "urgent", label: "Urgent", color: "#EF4444" },
  { id: "high", label: "High", color: "#F97316" },
  { id: "normal", label: "Normal", color: "#3B82F6" },
  { id: "low", label: "Low", color: "#10B981" },
]

// Task component with drag functionality
const Task = ({ task, onDelete, onEdit, onView, isNew = false, isDarkMode }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: { id: task.$id, sourceColumnId: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  })

  // Animation state
  const [animate, setAnimate] = useState(isNew)

  // Handle animation for new tasks
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 1500) // Back to original animation duration

      return () => clearTimeout(timer)
    }
  }, [isNew])

  // Find priority color
  const priorityOption = PRIORITY_OPTIONS.find((p) => p.id === task.priority) || PRIORITY_OPTIONS[2]

  return (
    <div
      ref={drag}
      className={`p-3 mb-2 ${isDarkMode ? "bg-[#1a212b] border-gray-700" : "bg-white border-gray-200"} 
        rounded-md shadow border ${isDragging ? "opacity-50" : "opacity-100"}
        ${animate ? "animate-pulse" : ""}
        transition-all duration-200 hover:shadow-md`}
      style={{ cursor: "pointer" }}
      onClick={(e) => {
        // Only trigger view if not clicking on buttons
        if (!e.target.closest("button")) {
          onView(task)
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className={`font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"} truncate max-w-[80%]`}>
          {task.title}
        </h3>
        <div className="flex space-x-1 shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(task)
            }}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer `}
          >
            <FiEdit2 size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(task.$id)
            }}
            className={`${isDarkMode ? "text-gray-400 hover:text-red-400" : "text-gray-500 hover:text-red-500"} cursor-pointer`}
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
      <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mb-2 line-clamp-2 overflow-hidden`}>
        {task.description}
      </p>
      <div className="flex items-center justify-between">
        <div className={`flex items-center text-xs ${isDarkMode ? "text-gray-500" : "text-gray-500"}`}>
          <FiClock className="mr-1 shrink-0" size={12} />
          <span className="truncate max-w-[80px]">ETA: {task.eta}</span>
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded-full shrink-0"
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

export default Task
export { PRIORITY_OPTIONS }

