'use client'

import { useState } from 'react'
import CreateTransLog from "@/components/CreateTransLog"
import CreateEnergyLog from "@/components/CreateEnergyLog"
import CreateFoodLog from "@/components/CreateFoodLog"
import CreateShoppingLog from "@/components/CreateShoppingLog"
// import EntryCard from "@/components/EntryCard"
// import EntryOptions from "@/components/EntryOptions"
// import Link from "next/link"

const ActivityLogClient = () => {
    const [selectedLogType, setSelectedLogType] = useState('transportation')

    const renderLogForm = () => {
        switch (selectedLogType) {
            case 'transportation':
                return <CreateTransLog />
            case 'energy':
                return <CreateEnergyLog />
            case 'food':
                return <CreateFoodLog />
            case 'shopping':
                return <CreateShoppingLog />
            default:
                return <CreateTransLog />
        }
    }

    return (
        <div className="h-full flex flex-col bg-emerald-100/30">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-4">
                <h2 className="text-3xl mb-6 font-bold text-gray-800">Log New Activity</h2>
                
                {/* Log Type Selector */}
                <div className="mb-2">
                    <label className="block mb-3 font-semibold text-gray-700">Select Activity Type:</label>
                    <div className="flex gap-3 flex-wrap">
                        <button
                            onClick={() => setSelectedLogType('transportation')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                selectedLogType === 'transportation'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white/80 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200'
                            }`}
                        >
                            Transportation
                        </button>
                        <button
                            onClick={() => setSelectedLogType('energy')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                selectedLogType === 'energy'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white/80 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200'
                            }`}
                        >
                            Energy
                        </button>
                        <button
                            onClick={() => setSelectedLogType('food')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                selectedLogType === 'food'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white/80 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200'
                            }`}
                        >
                            Food
                        </button>
                        <button
                            onClick={() => setSelectedLogType('shopping')}
                            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                selectedLogType === 'shopping'
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'bg-white/80 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 border border-emerald-200'
                            }`}
                        >
                            Shopping
                        </button>
                    </div>
                </div>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100 h-fit min-h-full">
                    <div className="p-1">
                        {/* Conditionally render the correct form */}
                        {renderLogForm()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityLogClient