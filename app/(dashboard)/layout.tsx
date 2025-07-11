import { UserButton } from "@clerk/nextjs"
import Link from "next/dist/client/link"


const DashboardLayout = ({ children }) => {
  return (
    <div className="h-screen w-screen relative bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 w-[200px] h-full bg-white border-r border-gray-200 shadow-sm">
        {/* Logo and Brand */}
        <div className="h-[60px] flex items-center px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            <span className="text-lg font-bold text-gray-900">EcoTrack</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          <a 
            href="/dashboard_home" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span className="text-lg">📊</span>
            <span className="font-medium">Dashboard</span>
          </a>
          
          <Link 
            href="/activitylog" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span className="text-lg">📝</span>
            <span className="font-medium">Activity Log</span>
          </Link>
          
          <Link 
            href="/analytics" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span className="text-lg">📈</span>
            <span className="font-medium">Analytics</span>
          </Link>

          <Link 
            href="/goals" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span className="text-lg">🎯</span>
            <span className="font-medium">Goals</span>
          </Link>

          <Link 
            href="/insights" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <span className="text-lg">🤖</span>
            <span className="font-medium">AI Insights</span>
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="ml-[200px] h-full">
        {/* Header */}
        <header className="h-[60px] bg-white border-b border-gray-200 shadow-sm">
          <div className="h-full w-full px-6 flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome back!</span>
              <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                <UserButton />
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area - Blank Canvas */}
        <div className="h-[calc(100vh-60px)] bg-white">
          <div className="p-6 h-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout