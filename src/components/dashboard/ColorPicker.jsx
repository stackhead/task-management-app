"use client"

// Color options for columns
const COLOR_OPTIONS = [
  { id: "gray", value: "#6B7280" },
  { id: "blue", value: "#3B82F6" },
  { id: "green", value: "#10B981" },
  { id: "yellow", value: "#F59E0B" },
  { id: "orange", value: "#F97316" },
  { id: "red", value: "#EF4444" },
  { id: "purple", value: "#8B5CF6" },
  { id: "pink", value: "#EC4899" },
]

// Color Picker Component
const ColorPicker = ({ selectedColor, onColorSelect }) => {
  return (
    <div className="flex space-x-2">
      {COLOR_OPTIONS.map((color) => (
        <button
          key={color.id}
          type="button"
          className={`w-6 h-6 rounded-full cursor-pointer ${
            selectedColor === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : ""
          }`}
          style={{ backgroundColor: color.value }}
          onClick={() => onColorSelect(color.value)}
        />
      ))}
    </div>
  )
}

export default ColorPicker
export { COLOR_OPTIONS }

