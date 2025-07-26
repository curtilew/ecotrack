'use client'

import { createNewEntry } from '@/utils/api';
import { useRouter } from 'next/navigation'
import { IoMdInformationCircleOutline } from "react-icons/io";



const ActivitySelector = () => {
    const router = useRouter()
    // @ts-expect-error - activityType is implicitly 'any' because no type is specified
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


      const logPreset = async (activityType, presetData) => {
        try {
            // Log the preset activity directly
            await createNewEntry(presetData, activityType);
            
            // Show success message (optional)
            alert(`${activityType} activity logged successfully!`);
            
            // Could redirect to dashboard or stay on selector
            // router.push('/dashboard');
        } catch (error) {
            console.error('Failed to log preset:', error);
            alert('Failed to log activity. Please try again.');
        }
    }

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
        <p className="text-md text-gray-400 max-w-2xl mx-auto px-6">
          <em>~ 1 minute for each log</em>
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
  
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className='relative group flex'>
          <p className='flex items-center text-xl font-bold text-black-400'>QUICK LOG <IoMdInformationCircleOutline className="align-super text-xl"/></p>
        <div className="absolute left-1/6 transform -translate-x-1/2 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
          Log recurring activities
        </div>
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => logPreset('transportation', { activityType: 'Car', distance: 25 })}
            className="p-2 bg-white rounded shadow text-sm hover:bg-gray-50"
          >
            🚗 Daily Commute (25mi)
          </button>
          <button 
            onClick={() => logPreset('energy', { energyType: 'Electricity', usage: 150, unit: 'kWh' })}
            className="p-2 bg-white rounded shadow text-sm hover:bg-gray-50"
          >
            ⚡ Weekly Home Energy (150kwh)
          </button>
        </div>
      </div>

    </div>
  );
};

export default ActivitySelector;