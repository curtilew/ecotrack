'use client'

import { useRouter } from 'next/navigation'
import { Utensils  } from 'lucide-react'
const ActivitySelector = () => {
    const router = useRouter()

    const handleActivitySelect = (activityType) => {
        // Store activity type and navigate to form page
        localStorage.setItem('selectedActivityType', activityType)
        router.push('/activityform')
    }

 const activities = [
{
  type: 'transportation',
  icon: 'M3 13h1l1-2h14l1 2h1a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-1.5a2.5 2.5 0 0 1-5 0h-7a2.5 2.5 0 0 1-5 0H2a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1zm15.5 4.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zm-12 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM6 11V7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4',
  iconViewBox: '0 0 24 24',
  title: 'Transportation',
  description: 'Track your commute and travel',
  color: 'from-emerald-100 to-emerald-200',
  hoverColor: 'hover:from-emerald-200 hover:to-emerald-300',
  textColor: 'text-emerald-800',
  iconColor: 'text-emerald-600'
},
    {
      type: 'energy',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      iconViewBox: '0 0 24 24',
      title: 'Energy',
      description: 'Input home & EV energy usage',
      color: 'from-emerald-50 to-emerald-100',
      hoverColor: 'hover:from-emerald-100 hover:to-emerald-200',
      textColor: 'text-emerald-700',
      iconColor: 'text-emerald-500'
    },
{
  type: 'food',
  icon: 'M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97L7 22h2l.25-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-7v8h2.5l1.5 11h2L20.5 10H22V2h-6z',
  iconViewBox: '0 0 24 24',
  title: 'Food',
  description: 'Log your meals and diet',
  color: 'from-emerald-100 to-emerald-150',
  hoverColor: 'hover:from-emerald-150 hover:to-emerald-200',
  textColor: 'text-emerald-800',
  iconColor: 'text-emerald-600'
},
    {
      type: 'shopping',
      icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.293 2.293c-.63.63-.184 1.707.707 1.707H19M7 13v4a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4m-8 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm8 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z',
      iconViewBox: '0 0 24 24',
      title: 'Shopping',
      description: 'Record purchases and items',
      color: 'from-emerald-200 to-emerald-300',
      hoverColor: 'hover:from-emerald-300 hover:to-emerald-400',
      textColor: 'text-emerald-800',
      iconColor: 'text-emerald-600'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-emerald-50 to-blue-50">
      {/* Header */}
      <div className="flex-shrink-0 text-center pt-12 pb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">
          Track Your Impact
        </h2>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto px-6">
          Choose an activity category to start logging your carbon footprint
        </p>
      </div>

      {/* Main Content - Activity Cards */}
      <div className="flex-1 flex items-center justify-center px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full">
          {activities.map((activity) => (
            <button
              key={activity.type}
              onClick={() => handleActivitySelect(activity.type)}
              className={`
                group relative overflow-hidden rounded-2xl bg-gradient-to-br ${activity.color} ${activity.hoverColor}
                transform hover:scale-105 transition-all duration-300 ease-out
                shadow-md hover:shadow-lg border border-emerald-200/50
                h-90 w-full
                focus:outline-none focus:ring-4 focus:ring-emerald-300/50
              `}
            >
              {/* Card Content */}
              <div className={`relative h-full flex flex-col items-center justify-center p-6 ${activity.textColor}`}>
                {/* Icon */}
                <div className={`mb-4 transform group-hover:scale-110 transition-transform duration-300 ${activity.iconColor}`}>
                  <svg 
                    className="w-12 h-12" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox={activity.iconViewBox} 
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={activity.icon} />
                  </svg>
                </div>
                
                {/* Title */}
                <h3 className="text-xl font-bold mb-2">
                  {activity.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm opacity-80 text-center leading-relaxed">
                  {activity.description}
                </p>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-emerald-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
              </div>

              {/* Ripple effect on click */}
              <div className="absolute inset-0 rounded-2xl ring-0 group-active:ring-4 ring-emerald-400/30 transition-all duration-150" />
            </button>
          ))}
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex-shrink-0 text-center pb-8">
        <p className="text-gray-900 text-lg">
          Click any category above to start logging your environmental impact
        </p>
      </div>
    </div>
  );
};

export default ActivitySelector;