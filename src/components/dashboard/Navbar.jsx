import { SiMailchimp } from "react-icons/si"
import LogoutButton from "./LogoutButton"

const Navbar = ({ user, isDarkMode }) => {
  return (
    <nav
      className={`flex justify-between items-center p-3 md:p-4 sticky top-0 left-0 right-0 ${
        isDarkMode ? "bg-[#010409] border-gray-800" : "bg-white border-gray-200"
      } backdrop-blur-3xl border-b shadow-md z-10`}
    >
      <h1 className={`text-[20px] font-medium ${isDarkMode ? "text-gray-100" : "text-gray-800"} truncate max-w-[70%]`}>
        {user ? (
          <>
            Welcome, {user.name} <SiMailchimp className="inline ml-2" />
          </>
        ) : (
          "Loading..."
        )}
      </h1>
      <LogoutButton isDarkMode={isDarkMode} />
    </nav>
  )
}

export default Navbar

