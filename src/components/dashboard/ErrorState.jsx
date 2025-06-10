import Link from "next/link"
import { PiImageBrokenLight } from "react-icons/pi";

const ErrorState = ({ error, isDarkMode }) => {
  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-950" : "bg-gradient-to-br from-indigo-50 to-blue-50"} flex items-center justify-center`}>
      <div className={`text-center p-6 ${isDarkMode ? "bg-gray-900" : "bg-white"} rounded-lg max-w-md shadow-lg`}>
        <div className=" mb-4 item-center flex justify-center text-red-500 "><PiImageBrokenLight className="h-12 w-16" /></div>
        <h2 className={`text-xl font-bold ${isDarkMode ? "text-gray-100" : "text-gray-800"} mb-2`}>
          oops Something went wrong
        </h2>
        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
          {error}
        </p>
        <Link href="/auth/login">
          <button
            className={`px-4 py-2 mt-3 ${
              isDarkMode ? "bg-gray-800 text-gray-100 hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            } rounded-md transition-colors cursor-pointer`}
          >
            Log in
          </button>
        </Link>
      </div>
    </div>
  )
}

export default ErrorState

