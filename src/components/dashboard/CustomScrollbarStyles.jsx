"use client"

const CustomScrollbarStyles = ({ isDarkMode }) => {
  return (
    <style jsx global>{`
      .custom-scrollbar::-webkit-scrollbar {
        width: thin;
      }

      .custom-scrollbar::-webkit-scrollbar-track {
        background: var(--scrollbar-track);
        border-radius: 20px;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: var(--scrollbar-thumb);
        border-radius: 4px;
        transition: background-color 0.2s;
      }

      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: ${isDarkMode ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.3)"};
      }

      /* Firefox scrollbar styles */
      .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
      }

      /* Add cursor pointer to all buttons and clickable elements */
      button, 
      [role="button"],
      .cursor-pointer {
        cursor: pointer;
      }
    `}</style>
  )
}

export default CustomScrollbarStyles

