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
    const [showConfetti, setShowConfetti] = useState(false)

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

    // Watch for successful form submissions
    useEffect(() => {
        const checkForSuccess = () => {
            const shouldRedirect = localStorage.getItem('formSubmitted')
            if (shouldRedirect === 'true') {
                localStorage.removeItem('formSubmitted')
                
                // Show confetti celebration!
                setShowConfetti(true)
                
                // After confetti, redirect back to activity selector
                setTimeout(() => {
                    localStorage.removeItem('selectedActivityType')
                    router.push('/activitylog')
                }, 4000) // 2 seconds of confetti
            }
        }

        const interval = setInterval(checkForSuccess, 1000)
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

    const renderLogForm = () => {
        switch (activityType) {
            case 'transportation':
                return <CreateTransLog />
            case 'energy':
                return <CreateEnergyLog />
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

    // Realistic confetti animation component
    const ConfettiAnimation = () => {
        const confettiPieces = Array.from({ length: 100 }, (_, i) => {
            const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
            const shapes = ['rectangle', 'circle', 'triangle']
            const shape = shapes[Math.floor(Math.random() * shapes.length)]
            const color = colors[Math.floor(Math.random() * colors.length)]
            
            return (
                <div
                    key={i}
                    className={`absolute pointer-events-none ${shape === 'circle' ? 'rounded-full' : ''}`}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: '-10px',
                        width: shape === 'triangle' ? '0' : `${4 + Math.random() * 8}px`,
                        height: shape === 'triangle' ? '0' : `${4 + Math.random() * 8}px`,
                        backgroundColor: shape === 'triangle' ? 'transparent' : color,
                        borderLeft: shape === 'triangle' ? `${3 + Math.random() * 4}px solid transparent` : 'none',
                        borderRight: shape === 'triangle' ? `${3 + Math.random() * 4}px solid transparent` : 'none',
                        borderBottom: shape === 'triangle' ? `${6 + Math.random() * 8}px solid ${color}` : 'none',
                        animation: `confettiFall ${2 + Math.random() * 3}s linear infinite`,
                        animationDelay: `${Math.random() * 2}s`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            )
        })

        return (
            <>
                <style jsx>{`
                    @keyframes confettiFall {
                        0% {
                            transform: translateY(-10px) rotate(0deg);
                            opacity: 1;
                        }
                        10% {
                            transform: translateY(10vh) rotate(36deg);
                        }
                        20% {
                            transform: translateY(20vh) rotate(72deg);
                        }
                        30% {
                            transform: translateY(30vh) rotate(108deg);
                        }
                        40% {
                            transform: translateY(40vh) rotate(144deg);
                        }
                        50% {
                            transform: translateY(50vh) rotate(180deg);
                        }
                        60% {
                            transform: translateY(60vh) rotate(216deg);
                        }
                        70% {
                            transform: translateY(70vh) rotate(252deg);
                        }
                        80% {
                            transform: translateY(80vh) rotate(288deg);
                        }
                        90% {
                            transform: translateY(90vh) rotate(324deg);
                        }
                        100% {
                            transform: translateY(100vh) rotate(360deg);
                            opacity: 0;
                        }
                    }
                `}</style>
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {confettiPieces}
                </div>
            </>
        )
    }

    if (!activityType) {
        return (
            <div className="h-full flex items-center justify-center bg-emerald-100/30">
                <div className="text-gray-500">Loading...</div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col bg-emerald-100/30 relative">
            {/* Confetti overlay */}
            {showConfetti && <ConfettiAnimation />}
            
            {/* Success message overlay */}
            {showConfetti && (
                <div className="fixed inset-0 flex items-center justify-center z-40 bg-black/20">
                    <div className="bg-white rounded-2xl p-8 shadow-2xl text-center animate-pulse">
                        <div className="text-6xl mb-4">🎉</div>
                        {/* <h2 className="text-2xl font-bold text-emerald-600 mb-2">Great Job!</h2> */}
                        <p className="text-gray-600">Activity logged successfully!</p>
                        {/* <div className="text-sm text-gray-500 mt-4">Making the planet greener, one activity at a time! 🌱</div> */}
                    </div>
                </div>
            )}

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