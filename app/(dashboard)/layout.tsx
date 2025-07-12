'use client';

import React from 'react';
import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { usePathname } from 'next/navigation';
import { Hammer} from 'lucide-react'
// Add this at the top of your component

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const pathname = usePathname();

  return (
    <div className="h-screen w-screen relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Sidebar Navigation */}
      <div className="fixed left-0 top-0 w-[240px] h-full bg-white/90 backdrop-blur-sm  shadow-lg">
        {/* Logo and Brand */}
        <div className="h-[70px] flex items-center px-6 ">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">🌱</span>
            </div>
            <div>
            <span className="text-xl font-bold text-gray-900">EcoTrack</span>
            <br />
            <span className="text-sm text-gray-900">Beta v0.8</span>
            </div>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="p-6 space-y-2">
          <Link 
            href="/dashboard_home" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group ${
              pathname === '/dashboard_home' ? 'bg-emerald-100 !text-emerald-700' : ''
            }`}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-emerald-600 transition-colors"></div>
            <span className="font-medium">Overview</span>
          </Link>
          
          <Link 
            href="/activitylog" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group ${
              pathname === '/activitylog' ? 'bg-emerald-100 !text-emerald-700' : ''
            }`}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-emerald-600 transition-colors"></div>
            <span className="font-medium">Activity Log</span>
          </Link>
          
          <Link 
            href="/analytics" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group ${
              pathname === '/analytics' ? 'bg-emerald-100 !text-emerald-700' : ''
            }`}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-emerald-600 transition-colors"></div>
            <span className="font-medium">Analytics</span>
          </Link>

          <div className="relative group">
              <div 
                className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
              >
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="font-medium">Goals</span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
                <Hammer size={14} /> Coming Soon
              </div>
          </div>

          <div className="pt-4 pb-2">
            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider px-4">Community</div>
          </div>


          <div className="relative group">
            <div 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
            >
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="font-medium">Leaderboard</span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
              <Hammer size={14} /> Coming Soon
            </div>
          </div>

          <div className="relative group">
            <div 
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed opacity-60"
            >
              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
              <span className="font-medium">Share Progress</span>
            </div>
            
            {/* Tooltip */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
              <Hammer size={14} /> Coming Soon
            </div>
          </div>


          <Link 
            href="/charities" 
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 transition-all duration-200 group ${
              pathname === '/charities' ? 'bg-emerald-100 !text-emerald-700' : ''
            }`}
          >
            <div className="w-2 h-2 bg-emerald-400 rounded-full group-hover:bg-emerald-600 transition-colors"></div>
            <span className="font-medium">Impact Partners</span>
          </Link>
        </nav>

        {/* Bottom Section - Optional */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-emerald-50/50 rounded-lg p-4 border border-emerald-100/50">
            <div className="text-xs text-emerald-700 font-medium mb-1">Your Impact</div>
            <div className="text-sm text-gray-600">Making progress every day</div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="ml-[240px] h-full">
        {/* Header */}
        <header className="h-[70px]bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 backdrop-blur-sm  ">
          <div className="h-full w-full px-8 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="text-xl font-medium text-emerald-800/50"><b>Welcome back!</b></span> 
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-shadow">
                <UserButton />
              </div>
            </div>
          </div>
        </header>
        
        {/* Content Area */}
        <div className="h-[calc(100vh-70px)] overflow-auto">
          <div className="p-2 h-full">
            <div className="h-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg   p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout;