import { SiMailchimp } from "react-icons/si";
import LogoutButton from "./LogoutButton";

const Navbar = ({ user, isDarkMode }) => {
  return (
    <nav
      className={`flex justify-between items-center px-4 py-3 md:px-6 sticky top-0 left-0 right-0 ${
        isDarkMode ? "bg-[#010409] border-gray-800" : "bg-white border-gray-200"
      } border-b backdrop-blur-lg z-50 transition-colors duration-300`}
    >
      <div className="flex items-center space-x-2">
        <SiMailchimp 
          className={`text-xl ${isDarkMode ? "text-blue-400" : "text-blue-600"} transition-transform hover:scale-110`} 
        />
        <h1 className={`text-lg font-semibold ${isDarkMode ? "text-gray-100" : "text-gray-800"} truncate max-w-[180px] md:max-w-[260px]`}>
          {user ? `Welcome, ${user.name}` : "Loading..."}
        </h1>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* {user && (
          // <span className={`hidden md:inline text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
          //   {user.email}
          // </span>
        )} */}
        <LogoutButton isDarkMode={isDarkMode} />
      </div>
    </nav>
  );
};

export default Navbar;