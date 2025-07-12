'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import CreateTransLog from "@/components/CreateTransLog"
import CreateEnergyLog from "@/components/CreateEnergyLog"
import CreateFoodLog from "@/components/CreateFoodLog"
import CreateShoppingLog from "@/components/CreateShoppingLog"

const ActivityFormPage = () => {
    const router = useRouter()
    const [activityType, setActivityType] = useState('')

    useEffect(() => {
        // Get activity type from localStorage
        const storedType = localStorage.getItem('selectedActivityType')
        if (storedType) {
            setActivityType(storedType)
        } else {
            // If no type found, go back to selector
            router.push('/activitylog')
        }
    }, [router])

    useEffect(() => {
        const checkForSuccess = () => {
            // Check if we should redirect (you can customize this logic)
            const shouldRedirect = localStorage.getItem('formSubmitted')
            if (shouldRedirect === 'true') {
                localStorage.removeItem('formSubmitted')
                localStorage.removeItem('selectedActivityType')
                router.push('/activitylog')
            }
        }

        // Check every 1 second for form completion
        const interval = setInterval(checkForSuccess, 1000)
        
        // Also listen for storage events (if form sets a flag)
        window.addEventListener('storage', checkForSuccess)
        
        return () => {
            clearInterval(interval)
            window.removeEventListener('storage', checkForSuccess)
        }
    }, [router])


    const handleBackToSelector = () => {
        localStorage.removeItem('selectedActivityType')
        router.push('/activitylog')
    }

    const handleSaveComplete = () => {
        // After saving, clear storage and go back to selector
        localStorage.removeItem('selectedActivityType')
        router.push('/activitylog')
    }

    const renderLogForm = () => {
        switch (activityType) {
            case 'transportation':
                return <CreateTransLog />
            case 'energy':
                return <CreateEnergyLog  />
            case 'food':
                return <CreateFoodLog />
            case 'shopping':
                return <CreateShoppingLog />
            default:
                return null
        }
    }

    const getActivityTitle = () => {
        const titles = {
            'transportation': '🚗 Transportation',
            'energy': '⚡ Energy',
            'food': '🍎 Food',
            'shopping': '🛍️ Shopping'
        }
        return titles[activityType] || 'Activity'
    }

    if (!activityType) {
        return (
            <div className="h-full flex items-center justify-center bg-emerald-100/30">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-emerald-100/30">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-6 pb-4">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBackToSelector}
                        className="px-3 py-1 text-emerald-600 hover:text-emerald-700 font-medium"
                    >
                        ← Back
                    </button>
                    <h2 className="text-3xl font-bold text-gray-800">
                        Log {getActivityTitle()}
                    </h2>
                </div>
            </div>

            {/* Scrollable Form Area */}
            <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-emerald-100 h-fit min-h-full">
                    <div className="p-1">
                        {renderLogForm()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityFormPage