'use client';

import React, { useState, useEffect } from 'react';

const DailyImpactVisualization = ({ yesterdayData }: { yesterdayData: number }) => {
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Average daily carbon footprint for comparison (in kg CO2)
  const averageDaily = 32.8; // Global average
  const ratio = yesterdayData / averageDaily;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  const getImpactLevel = () => {
    if (ratio <= 0.7) return 'excellent';
    if (ratio <= 1.0) return 'good';
    if (ratio <= 1.5) return 'concerning';
    if (ratio <= 2.0) return 'alarming';
    return 'devastating';
  };

  const impactLevel = getImpactLevel();
//@ts-expect-error: getVisualization is not typed
  const getVisualization = () => {        // add ai notes 
    switch (impactLevel) {
      case 'excellent':
        return {
          scene: '🌱',
          background: 'from-green-100 via-emerald-50 to-green-100',
          title: 'Planet Hero! 🌍✨',
          subtitle: 'You\'re healing the Earth',
          message: 'Your low footprint is like planting trees and cleaning the air!',
          effects: ['🌿', '🦋', '🌸', '💚', '🌺'],
          color: 'text-green-700',
          glow: 'drop-shadow-lg filter drop-shadow-green-500/30'
        };
      
      case 'good':
        return {
          scene: '🌳',
          background: 'from-blue-100 via-sky-50 to-blue-100',
          title: 'Eco Champion! 🏆',
          subtitle: 'You\'re protecting our planet',
          message: 'Your footprint is below average - keep up the great work!',
          effects: ['🌈', '☀️', '🌤️', '💙', '🦆'],
          color: 'text-blue-700',
          glow: 'drop-shadow-lg filter drop-shadow-blue-500/30'
        };
      
      case 'concerning':
        return {
          scene: '🌡️',
          background: 'from-yellow-100 via-amber-50 to-orange-100',
          title: 'Warning Signs 🚨',
          subtitle: 'The planet needs your help',
          message: 'Your footprint is heating up the Earth. Small changes can make a big difference!',
          effects: ['⚡', '🔥', '💨', '⚠️', '🌡️'],
          color: 'text-orange-700',
          glow: 'drop-shadow-lg filter drop-shadow-orange-500/40'
        };
      
      case 'alarming':
        return {
          scene: '🔥',
          background: 'from-red-100 via-rose-50 to-red-100',
          title: 'Emergency! 🚨🔥',
          subtitle: 'Our planet is in crisis',
          message: 'Your footprint is melting ice caps and destroying habitats. Urgent action needed!',
          effects: ['💥', '🌋', '🔥', '💀', '🆘'],
          color: 'text-red-700',
          glow: 'drop-shadow-lg filter drop-shadow-red-500/50'
        };
      
      case 'devastating':
        return {
          scene: '💀',
          background: 'from-gray-800 via-slate-700 to-gray-800',
          title: 'PLANET KILLER 💀⚰️',
          subtitle: 'Catastrophic damage',
          message: 'Your footprint is literally destroying Earth. Animals are dying. Act NOW!',
          effects: ['💀', '⚰️', '🌪️', '☠️', '💀'],
          color: 'text-red-300',
          glow: 'drop-shadow-lg filter drop-shadow-red-600/70'
        };
      
      default:
        //@ts-expect-error: default case is not typed
        return getVisualization.call(this, 'good');
    }
  };

  const visual = getVisualization();

  const getRealWorldEquivalent = () => {
    const impact = yesterdayData;
    if (impact <= 20) return "🌱 Like watering a garden";
    if (impact <= 35) return "🚶 Like walking instead of driving";
    if (impact <= 55) return "🚗 Like driving 50 miles";
    if (impact <= 70) return "✈️ Like a short flight";
    return "🛫 Like flying across the country";
  };

  const getAnimalImpact = () => {
    const treesKilled = Math.floor(ratio * 2.3);
    const animalsDisplaced = Math.floor(ratio * 15);
    
    if (impactLevel === 'excellent' || impactLevel === 'good') {
      return `🌳 You saved ${Math.max(1, 5 - treesKilled)} trees today!`;
    }
    return `💔 Your footprint displaced ${animalsDisplaced} animals and destroyed ${treesKilled} trees`;
  };

  const getTemperatureImpact = () => {
    const tempIncrease = (yesterdayData / 1000) * 0.001; // Rough calculation
    if (ratio <= 0.7) return "Cooling the planet by your choices!";
    if (ratio <= 1.0) return "Neutral temperature impact";
    if (ratio <= 1.5) return `Raised global temp by ${(tempIncrease * 1000).toFixed(3)}°C`;
    if (ratio <= 2.0) return `Heated Earth by ${(tempIncrease * 1500).toFixed(3)}°C`;
    return `SUPERHEATED planet by ${(tempIncrease * 2000).toFixed(3)}°C`;
  };

  const getIceCapImpact = () => {
    const iceLoss = yesterdayData * 0.02; // kg of ice melted per kg CO2
    if (ratio <= 0.7) return "Helped preserve Arctic ice!";
    if (ratio <= 1.0) return "Minimal ice cap impact";
    if (ratio <= 1.5) return `Melted ${iceLoss.toFixed(1)}kg of Arctic ice`;
    if (ratio <= 2.0) return `DESTROYED ${iceLoss.toFixed(1)}kg of glaciers`;
    return `OBLITERATED ${iceLoss.toFixed(1)}kg of polar ice caps`;
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex-1">
      <h2 className="text-xl font-medium mb-4 text-slate-700">Yesterday&apos;s Impact on Earth</h2>
      
      <div className={`relative h-64 rounded-xl bg-gradient-to-br ${visual.background} overflow-hidden border-2 ${impactLevel === 'devastating' ? 'border-red-600' : 'border-slate-200'}`}>
        
        {/* Animated background effects */}
        <div className="absolute inset-0">
          {/* @ts-expect-error: effects is not typed */}
          {visual.effects.map((effect, index) => (
            <div
              key={index}
              className="absolute text-2xl animate-bounce"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + Math.sin(animationPhase * 0.1 + index) * 20}%`,
                animationDelay: `${index * 0.2}s`,
                animationDuration: `${2 + (index * 0.3)}s`
              }}
            >
              {effect}
            </div>
          ))}
        </div>

        {/* Main scene */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-4">
          <div className={`text-6xl mb-3 ${visual.glow} animate-pulse`}>
            {visual.scene}
          </div>
          
          <h3 className={`text-2xl font-bold ${visual.color} mb-2`}>
            {visual.title}
          </h3>
          
          <p className={`text-lg ${visual.color} mb-2 font-medium`}>
            {visual.subtitle}
          </p>
          
          <p className={`text-sm ${visual.color} max-w-xs leading-tight`}>
            {visual.message}
          </p>
        </div>

        {/* Shaking effect for bad impacts */}
        {(impactLevel === 'alarming' || impactLevel === 'devastating') && (
          <div className="absolute inset-0 animate-pulse bg-red-500/10"></div>
        )}
      </div>

      {/* Impact metrics */}
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">Yesterday&apos;s CO₂:</span>
          <span className={`font-bold text-lg ${visual.color}`}>
            {yesterdayData.toFixed(1)} kg
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-600">vs Global Citizen:</span>
          <div className="flex items-center gap-1">
            {ratio > 1 ? (
              <span className="text-red-600">↑</span>
            ) : (
              <span className="text-green-600">↓</span>
            )}
            <span className={`font-medium ${ratio > 1 ? 'text-red-600' : 'text-green-600'}`}>
              {Math.abs((ratio - 1) * 100).toFixed(0)}% {ratio > 1 ? 'above' : 'below'} avg
            </span>
          </div>
        </div>

        <div className="text-xs text-slate-500 pt-2 border-t border-slate-200 space-y-1">
          <div>📊 {getRealWorldEquivalent()}</div>
          <div>{getAnimalImpact()}</div>
          <div className={`font-medium ${ratio > 1.5 ? 'text-red-600' : ratio > 1 ? 'text-orange-600' : 'text-green-600'}`}>
            🌡️ {getTemperatureImpact()}
          </div>
          <div className={`font-medium ${ratio > 1.5 ? 'text-red-600' : ratio > 1 ? 'text-orange-600' : 'text-green-600'}`}>
            🧊 {getIceCapImpact()}
          </div>
        </div>

        {/* Progress bar showing intensity */}
        <div className="mt-3">
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${
                impactLevel === 'excellent' ? 'bg-green-500' :
                impactLevel === 'good' ? 'bg-blue-500' :
                impactLevel === 'concerning' ? 'bg-yellow-500' :
                impactLevel === 'alarming' ? 'bg-red-500' :
                'bg-gray-800'
              }`}
              style={{ width: `${Math.min(100, (ratio / 3) * 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Earth-friendly</span>
            <span>Planet killer</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyImpactVisualization;