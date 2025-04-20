"use client"

import { FiPlus, FiMoon } from "react-icons/fi"
import { LuSunMedium } from "react-icons/lu"

const Header = ({ toggleTheme, openAddColumnModal, isDarkMode }) => {
  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h2 className={`md:text-[25px] max-md:text-[20px] font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}>
          Task Pilot
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-md ${
              isDarkMode
                ? "bg-gray-800 text-yellow-400 hover:bg-gray-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors cursor-pointer`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <LuSunMedium size={18} /> : <FiMoon size={18} />}
          </button>
          <button
            onClick={openAddColumnModal}
            className={`md:px-4 px-2 md:py-[5px] max-md:py-[5px] ${
              isDarkMode ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } rounded-md flex items-center transition-colors cursor-pointer`}
          >
            <FiPlus size={16} className="mr-1" /> Add Column
          </button>
        </div>
      </div>
      <h2
        className={`md:text-sm max-md:text-[13px] font-light md:w-[40%] ${isDarkMode ? "text-gray-100" : "text-gray-600"} mb-6`}
      >
        Streamline your workflow with an intuitive Kanban board designed for seamless task management.
      </h2>
    </>
  )
}

export default Header

