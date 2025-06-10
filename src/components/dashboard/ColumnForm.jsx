"use client"

import { useState } from "react"
import ColorPicker from "./ColorPicker"

const ColumnForm = ({
  columnName,
  setColumnName,
  columnColor,
  setColumnColor,
  onSubmit,
  onClose,
  currentColumn,
  isDarkMode,
}) => {
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false)
  const [customColor, setCustomColor] = useState("#3b82f6") // Default blue color
  
  const handleCustomColorSelect = () => {
    setColumnColor(customColor)
    setShowCustomColorPicker(false)
  }
  
  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="mb-4">
        <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
          Column Name
        </label>
        <input
          type="text"
          value={columnName}
          onChange={(e) => setColumnName(e.target.value)}
          className={`w-full px-3 py-2 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-500"
              : "bg-white border-gray-300 text-gray-800 placeholder-gray-400"
          } border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-600`}
          required
        />
      </div>
      
      <div className="mb-2 md:mb-4">
        <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
          Color
        </label>
        
        <div className="flex items-center gap-3">
          <ColorPicker selectedColor={columnColor} onColorSelect={setColumnColor} />
          
          {/* Custom Color Circle */}
          <div
            className="w-8 h-8 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer"
            style={{ borderColor: isDarkMode ? '#4b5563' : '#d1d5db' }}
            onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
          >
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: customColor }}
            />
          </div>
        </div>
        
        {/* Custom Color Picker */}
        {showCustomColorPicker && (
          <div className="mt-3 p-3 rounded-md" style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f3f4f6' }}>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-10 h-10 cursor-pointer"
              />
              <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {customColor}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCustomColorSelect}
              className={`px-3 py-1 text-sm rounded-md ${
                isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500 text-white"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              Apply Custom Color
            </button>
          </div>
        )}
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
          {currentColumn ? "Update" : "Create"}
        </button>
      </div>
    </form>
  )
}

// Column component with adaptive height
const Column = ({ 
  column, 
  children, 
  isDarkMode 
}) => {
  // Ensure the column container adapts to its content
  return (
    <div 
      className={`flex flex-col h-auto rounded-md overflow-hidden ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
      style={{ 
        borderLeft: `4px solid ${column.color || '#3b82f6'}`,
        minHeight: "100px", // Minimum height to ensure visibility when empty
      }}
    >
      {/* Column header */}
      <div 
        className={`p-3 font-medium border-b ${
          isDarkMode ? "border-gray-700 text-gray-200" : "border-gray-200 text-gray-800"
        }`}
      >
        {column.name}
      </div>
      
      {/* Column content - will expand with items */}
      <div className="flex-grow overflow-y-auto">
        {children}
      </div>
    </div>
  )
}

export default ColumnForm
export { Column }