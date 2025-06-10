"use client"

import { FiSun, FiMoon } from "react-icons/fi"

const Header = ({ toggleTheme, isDarkMode }) => {
  return (
    <div className="flex justify-between items-center md:p-4 max-md:p-2 ">
      <div>
        <h1 className={`text-2xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>Task Pilot</h1>
        <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"} mt-1`}>
          Manage your tasks efficiently
        </p>
      </div>
{/* 
      <div className="flex items-center space-x-3">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-colors ${
            isDarkMode ? "bg-gray-800 text-gray-300 hover:bg-gray-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
      </div> */}
    </div>
  )
}

export default Header
