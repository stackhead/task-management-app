"use client"

import { FiEdit2, FiTrash2, FiPlus, FiMoreVertical, FiX } from "react-icons/fi"
import { useDrop, useDrag } from "react-dnd"
import { useEffect, useState, useRef } from "react"
import Task from "./Task"

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
  moveColumn,
  index,
  isNew = false,
  isDarkMode,
}) => {
  const columnRef = useRef(null)
  const [columnHeight, setColumnHeight] = useState(0)

  // Drag and drop for tasks (only for the tasks container)
  const [{ isOver }, taskDropRef] = useDrop({
    accept: "TASK",
    drop: (item) => {
      moveTask(item.id, item.sourceColumnId, column.$id)
      return { moved: true }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  })

  // Drag source for columns (only for the grip handle)
  const [{ isDragging }, columnDragRef] = useDrag({
    type: "COLUMN",
    item: { id: column.$id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Drop zone for columns (for the entire column)
  const [, columnDropRef] = useDrop({
    accept: "COLUMN",
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index)
        draggedItem.index = index
      }
    },
  })

  const [animate, setAnimate] = useState(isNew)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const columnTasks = tasks.filter((task) => task.status === column.$id)
  const hasTasks = columnTasks.length > 0

  // Column color setup
  const columnColor = column.color || (isDarkMode ? "#6B7280" : "#9CA3AF")
  const bgStyle = {
    backgroundColor: isDarkMode ? `${columnColor}20` : `${columnColor}15`,
  }

  // Calculate and update column height
  useEffect(() => {
    const updateColumnHeight = () => {
      if (columnRef.current) {
        const windowHeight = window.innerHeight
        const columnTop = columnRef.current.getBoundingClientRect().top
        const maxHeight = windowHeight - columnTop - 32 // 32px for padding/margins
        setColumnHeight(maxHeight)
      }
    }

    updateColumnHeight()
    window.addEventListener('resize', updateColumnHeight)
    return () => window.removeEventListener('resize', updateColumnHeight)
  }, [])
  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setAnimate(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isNew])

  const handleDeleteClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteModal(true)
    setIsMenuOpen(false)
  }

  const confirmDelete = (e) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }

    // Prevent any browser confirmations by wrapping the call
    try {
      // Temporarily override window.confirm to prevent browser dialogs
      const originalConfirm = window.confirm
      window.confirm = () => true

      onDeleteColumn(column.$id)

      // Restore original confirm function
      window.confirm = originalConfirm
    } catch (error) {
      console.error("Error deleting column:", error)
    }

    setShowDeleteModal(false)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
  }

  // Custom grip icon component
  const GripIcon = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={isDarkMode ? "text-gray-400" : "text-gray-500"}
    >
      <circle cx="9" cy="5" r="1" fill="currentColor" />
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="9" cy="19" r="1" fill="currentColor" />
      <circle cx="15" cy="5" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="19" r="1" fill="currentColor" />
    </svg>
  )

  return (
    <>
      <div
        ref={columnDropRef} // Only column drop zone on the entire column
        className={` w-72 min-w-[18rem] flex-shrink-0 rounded-lg transition-all duration-300 flex flex-col 
    ${animate ? "animate-pulse" : ""}
    ${isDragging ? "opacity-50" : ""}
    shadow-sm h-fit`}
        style={{
          border: isDarkMode ? `1px solid ${columnColor}20` : `1px solid ${columnColor}30`,
          // Custom ring effect using the column's color - only show when tasks are being dragged over
          boxShadow: isOver ? `0 0 0 2px ${columnColor}${isDarkMode ? "60" : "40"}` : undefined,
        }}
      >
        {/* Column Header */}
        <div
          className={`p-3 flex items-center justify-between rounded-t-lg
    ${isDarkMode ? "hover:bg-[#1F2937]" : "hover:bg-gray-100"}
    transition-colors duration-200`}
          style={bgStyle}
        >
          <div className="flex items-center flex-1 min-w-0 space-x-2">
            {/* Drag handle for column - only this element is draggable for column reordering */}
            <div
              ref={columnDragRef} // Column drag source only on the grip handle
              className={`cursor-grab p-1 rounded ${isDarkMode ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`}
              title="Drag to reorder column"
            >
              <GripIcon />
            </div>
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: columnColor }} />
            <h2 className={`font-semibold truncate ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
              {column.name}
            </h2>
            <span
              className={`ml-2 px-2 py-0.5 text-xs rounded-full ${isDarkMode ? "bg-[#2D3748]/60 text-gray-300" : "bg-white text-gray-600"}`}
            >
              {columnTasks.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEditColumn(column)
              }}
              className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`}
              aria-label="Edit column"
            >
              <FiEdit2 size={14} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
            </button>
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(!isMenuOpen)
                }}
                className={`p-1 rounded ${isDarkMode ? "hover:bg-gray-700/60" : "hover:bg-gray-200"}`}
                aria-label="Column options"
              >
                <FiMoreVertical size={14} className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              </button>

              {isMenuOpen && (
                <div
                  className={`absolute right-0 mt-1 w-40 rounded-md shadow-lg z-10 ${isDarkMode ? "bg-[#1F2937] border border-gray-700" : "bg-white border border-gray-200"}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={handleDeleteClick}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center ${isDarkMode ? "text-red-400 hover:bg-gray-700" : "text-red-500 hover:bg-gray-100"}`}
                  >
                    <FiTrash2 className="mr-2" size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tasks Container - This is where task drop zone should be */}
        <div
          ref={taskDropRef} // Task drop zone only on the tasks container
          className={`p-2 space-y-2 flex-1 ${hasTasks ? "" : "min-h-[20px]"}`}
          style={bgStyle}
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
              isNew={task._isNew}
            />
          ))}
        </div>

        {/* Add Task Button */}
        <div className="px-2 pb-2 rounded-b-lg" style={bgStyle}>
          <button
            onClick={() => onAddTask(column.$id)}
            className={`w-full py-2 flex items-center justify-center text-sm rounded-md
              ${
                isDarkMode
                  ? "text-gray-300 bg-[#1a212b] hover:bg-[#2D3748]"
                  : "text-gray-600 bg-white hover:bg-gray-100"
              }
              transition-colors duration-200`}
          >
            <FiPlus size={16} className="mr-2" /> Add Task
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? "bg-black/70" : "bg-black/50"}`}
          onClick={cancelDelete}
        >
          <div
            className={`w-full max-w-md rounded-lg p-6 ${isDarkMode ? "bg-[#161B22]" : "bg-white"} shadow-xl`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
                Delete Column
              </h3>
              <button
                onClick={cancelDelete}
                className={`p-1 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                aria-label="Close"
              >
                <FiX className={isDarkMode ? "text-gray-400" : "text-gray-500"} />
              </button>
            </div>

            <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Are you sure you want to delete the "{column.name}" column?
              {hasTasks && ` This will also delete ${columnTasks.length} task(s) in this column.`}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className={`px-4 py-2 rounded-md ${isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"}`}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className={`px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors`}
              >
                Delete Column
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Column
