import { FiLoader } from "react-icons/fi"

const LoadingState = ({ isDarkMode }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gradient-to-br from-indigo-50 to-blue-50"} flex items-center justify-center`}>
      <div className="text-center">
        <FiLoader className={`animate-spin h-10 w-10 ${isDarkMode ? "text-gray-400" : "text-gray-500"} mx-auto mb-4`} />
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Hang tight, we're almost done...</p>
      </div>
    </div>
  )
}

export default LoadingState

