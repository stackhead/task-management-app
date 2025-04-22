export default function Loading() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-indigo-600 rounded-full border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700">Loading...</p>
        </div>
      </div>
    )
  }
  