"use client";
import { useState } from "react";
import { SiMailchimp } from "react-icons/si";
import LogoutButton from "@/components/dashboard/LogoutButton";
import { FiSettings, FiSun, FiMoon, FiClock, FiMap, FiHelpCircle, FiLogOut } from "react-icons/fi";
import Link from "next/link";

const Navbar = ({ user, isDarkMode, toggleDarkMode }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <>
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
          <div className="relative">
            <button 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}
            >
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user?.name?.charAt(0) || "A"}
              </div>
            </button>

            {/* Profile Dropdown Modal */}
            {isProfileOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className={`absolute right-0 mt-2 w-64 rounded-md shadow-lg z-50 ${
                  isDarkMode ? "bg-[#161B22] border border-gray-700" : "bg-white border border-gray-200"
                }`}>
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className={`text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                      {user?.name || "User"}
                    </h3>
                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                  
                  <div className="py-1 text-black cursor-pointer">
                    {/* Profile Settings */}
                    <div className={`px-4 py-2 text-sm ${isDarkMode ? "" : "hover:bg-gray-100"}`}>
                      <Link href="/profile">
                      <div className="flex items-center">
                        <FiSettings className="mr-3" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Profile settings</span>
                      </div>
                      </Link>
                    </div>
                    
                    {/* Theme Toggle */}
                    <button 
                      onClick={toggleDarkMode}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center ${
                        isDarkMode ? "hover:bg-gray-800 text-gray-300" : "hover:bg-gray-100 "
                      }`}
                    >
                      {isDarkMode ? (
                        <>
                          <FiSun className="mr-3" />
                          Light Mode
                        </>
                      ) : (
                        <>
                          <FiMoon className="mr-3" />
                          Dark Mode
                        </>
                      )}
                    </button>
                    
                    {/* Updates */}
                    <div className={`px-4 py-2 text-sm text-black cursor-pointer ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center">
                        <FiClock className="mr-3" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Latest platform updates</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="py-1  border-gray-200 text-black cursor-pointer dark:border-gray-700">
                    {/* Product Roadmap */}
                    <div className={`px-4 py-2 text-sm ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center">
                        <FiMap className="mr-3" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Product roadmap</span>
                      </div>
                    </div>
                    
                    {/* Support */}
                    <div className={`px-4 py-2 text-sm ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"}`}>
                      <div className="flex items-center">
                        <FiHelpCircle className="mr-3" />
                        <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>Support</span>
                      </div>
                    </div>
<div className="py-1 w-full">
                    {/* Logout Button */}
                    <LogoutButton 
                    >
                      <FiLogOut className="mr-3" />
                      Log out
                    </LogoutButton>
                  </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content with Static UI */}
      {/* <div className="container mx-auto px-4 py-6"> */}
       
        {/* <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button className={`px-3 py-1 rounded-md text-sm ${
              isDarkMode ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800"
            }`}>
              + Add new
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${
              isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-700"
            }`}>
              Table view
            </button>
            <button className={`px-3 py-1 rounded-md text-sm ${
              isDarkMode ? "bg-gray-700 text-white" : "bg-gray-200 text-gray-800"
            }`}>
              Kanban board
            </button>
          </div>
          
          <div className={`flex items-center px-3 py-1 rounded-md text-sm ${
            isDarkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}>
            <span>Qsearch</span>
            <span className="ml-2">O</span>
          </div>
        </div> */}
        
        
        {/* <div className={`rounded-lg p-6 ${
          isDarkMode ? "bg-[#0D1117] text-gray-300" : "bg-white text-gray-800"
        }`}>
          <h1 className="text-2xl font-bold mb-4">Abu Bakar</h1>
          
          <div className="space-y-4">
            <div>
              <h2 className="font-medium mb-2">Profile settings</h2>
              <p className="text-sm">Theme</p>
              <p className="text-sm">Latest platform updates</p>
            </div>
            
            <div>
              <h2 className="font-medium mb-2">Product roadmap</h2>
              <p className="text-sm">Support</p>
            </div>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-red-500 text-sm flex items-center">
                <FiLogOut className="mr-2" />
                Log out
              </button>
            </div>
          </div>
        </div> */}
      {/* </div> */}
    </>
  );
};

export default Navbar;