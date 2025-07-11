// /app/activitylog/ActivityLogClient.tsx (Client Component)
'use client'

import { useState } from 'react'
import CreateTransLog from "@/components/CreateTransLog"
import CreateEnergyLog from "@/components/CreateEnergyLog"
import CreateFoodLog from "@/components/CreateFoodLog"
import CreateShoppingLog from "@/components/CreateShoppingLog"
import EntryCard from "@/components/EntryCard"
import EntryOptions from "@/components/EntryOptions"
import Link from "next/link"

const ActivityLogClient = ({ logs }) => {
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

    const getLogRoute = (log) => {
        // Route to the appropriate log detail page based on log type
        const routeMap = {
            'transportation': `/activitylog/transportation/${log.id}`,
            'energy': `/activitylog/energy/${log.id}`,
            'food': `/activitylog/food/${log.id}`,
            'shopping': `/activitylog/shopping/${log.id}`,
        }
        return routeMap[log.logType] || `/activitylog/${log.id}`
    }

    return (
        <div className="p-10 bg-zinc-400/10 h-full">
            <h2 className="text-3xl mb-8">Log New Activity</h2>
            
            {/* Log Type Selector */}
            <div className="mb-6">
                <label className="block mb-2 font-semibold">Select Activity Type:</label>
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setSelectedLogType('transportation')}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            selectedLogType === 'transportation'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        🚗 Transportation
                    </button>
                    <button
                        onClick={() => setSelectedLogType('energy')}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            selectedLogType === 'energy'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        ⚡ Energy
                    </button>
                    <button
                        onClick={() => setSelectedLogType('food')}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            selectedLogType === 'food'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        🍎 Food
                    </button>
                    <button
                        onClick={() => setSelectedLogType('shopping')}
                        className={`px-4 py-2 rounded font-semibold transition ${
                            selectedLogType === 'shopping'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        🛍️ Shopping
                    </button>
                </div>
            </div>

            <div className="gap-4">
                {/* Conditionally render the correct form */}
                {renderLogForm()}
                
                {/* <EntryOptions /> */}
                
                {/* Display all logs with proper routing */}
                <div className="mt-8">
                    <h3 className="text-2xl mb-4">Recent Activities</h3>
                    {logs.length > 0 ? (
                        logs.map((log) => (
                            <Link href={getLogRoute(log)} key={log.id}>
                                <EntryCard log={log} />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No activities logged yet. Start by adding your first activity above!</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ActivityLogClient