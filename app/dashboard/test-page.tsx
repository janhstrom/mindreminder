"use client"

export default function TestDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Dashboard Test Page</h1>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-lg">If you can see this, the dashboard route is working.</p>
          <div className="mt-4">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Go to Main Dashboard
            </a>
          </div>
          <div className="mt-2">
            <a href="/settings" className="text-purple-600 hover:underline">
              Go to Settings
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
