"use client"

import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi"
import { useDrop } from "react-dnd"
import { useEffect, useState } from "react"
import Task from "./Task"

// Column component with drop functionality
const Column = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onEditTask,
  onViewTask,
  onDeleteColumn,
  onEditColumn,
  moveTask,
  isNew = false,
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

  // Animation state
  const [animate, setAnimate] = useState(isNew)

  // Handle animation for new columns
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 1500) // Back to original animation duration

      return () => clearTimeout(timer)
    }
  }, [isNew])

  // Filter tasks that belong to this column
  const columnTasks = tasks.filter((task) => task.status === column.$id)

  return (
    <div
      className={`w-72 min-w-[18rem] border border-[#bdbdbd] flex-shrink-0 
        ${isDarkMode ? "bg-[#010409]" : "bg-gray-100"} 
        rounded-md ${isOver ? "bg-opacity-80" : ""}
        ${animate ? "animate-pulse" : ""}
        transition-all duration-300`}
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <div
        className={`p-3 ${isDarkMode ? "border-gray-700" : "border-gray-200"} border-b flex items-center border border-[#cecece] space-x-2`}
      >
        <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: column.color || "#6B7280" }} />
        <div className="flex items-center flex-1 min-w-0">
          <h2 className={`font-bold truncate ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{column.name}</h2>
          <span
            className={`ml-2 px-2 py-0.5 text-xs rounded-full shrink-0 ${isDarkMode ? "bg-gray-800 text-gray-400" : "bg-gray-200 text-gray-600 "}`}
          >
            {columnTasks.length}
          </span>
        </div>
        <div className="flex space-x-1 shrink-0">
          <button
            onClick={() => onEditColumn(column)}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer `}
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
            onView={onViewTask}
            moveTask={moveTask}
            isDarkMode={isDarkMode}
            isNew={task._isNew} // Pass isNew flag to task
          />
        ))}
      </div>

      <div className={`${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
        <button
          onClick={() => onAddTask(column.$id)}
          className={`w-full py-3 flex items-center justify-center text-sm ${
            isDarkMode ? "text-gray-300 bg-gray-950 hover:bg-gray-900" : "text-gray-700 bg-white hover:bg-gray-200"
          } rounded transition-colors cursor-pointer`}
        >
          <FiPlus size={16} className="mr-1" /> Add Task
        </button>
      </div>
    </div>
  )
}

export default Column

