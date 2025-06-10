"use client"

import { FiPlus } from "react-icons/fi"

const AddColumnButton = ({ onClick, isDarkMode }) => {
  return (
    <div className="w-72 min-w-[18rem] flex-shrink-0">
      <button
        onClick={onClick}
        className={`w-full h-32 rounded-lg border-2 border-dashed transition-all duration-200 flex flex-col items-center justify-center space-y-2 ${
          isDarkMode
            ? "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300 hover:bg-gray-800/50"
            : "border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-600 hover:bg-gray-50"
        }`}
      >
        <FiPlus size={24} />
        <span className="text-sm font-medium">Add Column</span>
      </button>
    </div>
  )
}

export default AddColumnButton
