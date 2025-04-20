"use client"

import { FiAlignLeft, FiClock, FiFlag } from "react-icons/fi"
import { PRIORITY_OPTIONS } from "./Task"

const TaskForm = ({
  taskTitle,
  setTaskTitle,
  taskDescription,
  setTaskDescription,
  taskEta,
  setTaskEta,
  taskPriority,
  setTaskPriority,
  taskColumnId,
  setTaskColumnId,
  columns,
  onSubmit,
  onClose,
  currentTask,
  isDarkMode,
}) => {
  return (
    <form onSubmit={onSubmit} className="w-full">
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
            <FiClock size={14} className="mr-1" /> ETA (Due Date)
          </div>
        </label>
        <input
          type="date"
          value={taskEta}
          onChange={(e) => setTaskEta(e.target.value)}
          className={`w-full px-3 py-2 ${
            isDarkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-800"
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
          onClick={onClose}
          className={`mr-2 px-4 py-2 ${
            isDarkMode ? "text-gray-300 bg-gray-800 hover:bg-gray-700" : "text-gray-600 bg-gray-200 hover:bg-gray-300"
          } rounded-md transition-colors cursor-pointer`}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`px-4 py-2 ${
            isDarkMode ? "bg-gray-100 text-gray-900 hover:bg-gray-200" : "bg-gray-800 text-white hover:bg-gray-700"
          } rounded-md transition-colors cursor-pointer`}
        >
          {currentTask ? "Update" : "Create"}
        </button>
      </div>
    </form>
  )
}

export default TaskForm

