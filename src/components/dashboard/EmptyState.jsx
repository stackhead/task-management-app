"use client"

import { FiPlus } from "react-icons/fi"

const EmptyState = ({ openAddColumnModal, isDarkMode }) => {
  return (
    <div
      className={`flex items-center justify-center h-[calc(100vh-250px)] ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
    >
      <div className="text-center">
        <p className="mb-4">No columns yet. Start by creating your first column!</p>
        <button
          onClick={openAddColumnModal}
          className={`px-4 py-2 ${
            isDarkMode ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          } rounded-md flex items-center transition-colors cursor-pointer mx-auto`}
        >
          <FiPlus size={16} className="mr-1" /> Add Column
        </button>
      </div>
    </div>
  )
}

export default EmptyState

