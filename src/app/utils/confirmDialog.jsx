/**
 * Custom confirmation dialog utility to replace the browser's default confirm
 * @param {string} message - The message to display
 * @param {string} title - The title of the dialog
 * @param {boolean} isDarkMode - Whether dark mode is enabled
 * @returns {Promise<boolean>} - Resolves to true if confirmed, false if cancelled
 */
export function confirmDialog(message, title = "Confirm", isDarkMode = false) {
  return new Promise((resolve) => {
    // Create modal container
    const modalContainer = document.createElement("div")
    modalContainer.className = `fixed inset-0 z-50 flex items-center justify-center p-4 ${
      isDarkMode ? "bg-black/70" : "bg-black/50"
    }`

    // Create modal content
    const modalContent = document.createElement("div")
    modalContent.className = `w-full max-w-md rounded-lg p-6 ${isDarkMode ? "bg-[#161B22]" : "bg-white"} shadow-xl`

    // Create title
    const titleElement = document.createElement("h3")
    titleElement.className = `text-lg font-semibold mb-4 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`
    titleElement.textContent = title

    // Create message
    const messageElement = document.createElement("p")
    messageElement.className = `mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`
    messageElement.textContent = message

    // Create button container
    const buttonContainer = document.createElement("div")
    buttonContainer.className = "flex justify-end space-x-3"

    // Create cancel button
    const cancelButton = document.createElement("button")
    cancelButton.className = `px-4 py-2 rounded-md ${
      isDarkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-600 hover:bg-gray-200"
    }`
    cancelButton.textContent = "Cancel"
    cancelButton.onclick = () => {
      document.body.removeChild(modalContainer)
      resolve(false)
    }

    // Create confirm button
    const confirmButton = document.createElement("button")
    confirmButton.className = "px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
    confirmButton.textContent = "Delete"
    confirmButton.onclick = () => {
      document.body.removeChild(modalContainer)
      resolve(true)
    }

    // Assemble modal
    buttonContainer.appendChild(cancelButton)
    buttonContainer.appendChild(confirmButton)
    modalContent.appendChild(titleElement)
    modalContent.appendChild(messageElement)
    modalContent.appendChild(buttonContainer)
    modalContainer.appendChild(modalContent)

    // Add click handler to close on backdrop click
    modalContainer.onclick = (e) => {
      if (e.target === modalContainer) {
        document.body.removeChild(modalContainer)
        resolve(false)
      }
    }

    // Add to DOM
    document.body.appendChild(modalContainer)
  })
}
