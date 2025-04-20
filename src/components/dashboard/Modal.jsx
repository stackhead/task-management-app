"use client"

import { FiX } from "react-icons/fi"

// Modal component for forms
const Modal = ({ isOpen, onClose, title, children, isDarkMode }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`${isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"} rounded-lg p-6 w-full md:max-w-md max-w-sm border`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>{title}</h2>
          <button
            onClick={onClose}
            className={`${isDarkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"} cursor-pointer`}
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

export default Modal

