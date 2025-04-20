"use client"

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
  return (
    <form onSubmit={onSubmit}>
      <div className="mb-2 md:mb-4">
        <label className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"} mb-1`}>
          Color
        </label>
        <ColorPicker selectedColor={columnColor} onColorSelect={setColumnColor} />
      </div>
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

export default ColumnForm

