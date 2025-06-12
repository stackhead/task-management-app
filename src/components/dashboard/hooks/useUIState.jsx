"use client"

import { useState, useEffect, useRef } from "react"

export function useUIState() {
  const [boardHeight, setBoardHeight] = useState("calc(100vh - 180px)")
  const containerRef = useRef(null)

  // Calculate board height on mount and window resize
  useEffect(() => {
    const calculateHeight = () => {
      if (containerRef.current) {
        const navHeight = document.querySelector("nav")?.offsetHeight || 0
        const headerHeight = 120 // Approximate header height
        const windowHeight = window.innerHeight
        const newHeight = windowHeight - navHeight - headerHeight - 50 // 50px buffer
        setBoardHeight(`${newHeight}px`)
      }
    }

    calculateHeight()
    window.addEventListener("resize", calculateHeight)

    return () => {
      window.removeEventListener("resize", calculateHeight)
    }
  }, [])

  // Add animation keyframes to the document
  useEffect(() => {
    // Add keyframes for animations if they don't exist
    if (!document.getElementById("kanban-animations")) {
      const style = document.createElement("style")
      style.id = "kanban-animations"
      style.innerHTML = `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-pulse {
          animation: pulse 0.5s ease-in-out 3;
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `
      document.head.appendChild(style)
    }
  }, [])

  return {
    boardHeight,
    containerRef,
  }
}
