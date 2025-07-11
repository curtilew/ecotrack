'use client'

import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data - replace with actual data from your APIs
  const carbonTrendData = [
    { date: '2025-07-05', transportation: 12.5, energy: 8.2, food: 6.1, shopping: 3.2, total: 30.0 },
    { date: '2025-07-06', transportation: 8.3, energy: 9.1, food: 7.2, shopping: 2.1, total: 26.7 },
    { date: '2025-07-07', transportation: 15.2, energy: 7.8, food: 5.9, shopping: 4.5, total: 33.4 },
    { date: '2025-07-08', transportation: 6.1, energy: 8.9, food: 6.8, shopping: 1.8, total: 23.6 },
    { date: '2025-07-09', transportation: 11.4, energy: 7.5, food: 6.2, shopping: 3.9, total: 29.0 },
    { date: '2025-07-10', transportation: 9.8, energy: 8.7, food: 5.4, shopping: 2.3, total: 26.2 },
    { date: '2025-07-11', transportation: 13.1, energy: 9.2, food: 6.7, shopping: 3.8, total: 32.8 },
  ];

  const categoryBreakdown = [
    { name: 'Transportation', value: 76.4, percentage: 45.2, color: '#3B82F6' },
    { name: 'Energy', value: 59.4, percentage: 35.1, color: '#F59E0B' },
    { name: 'Food', value: 44.3, percentage: 26.2, color: '#10B981' },
    { name: 'Shopping', value: 21.6, percentage: 12.8, color: '#8B5CF6' },
  ];

  const weeklyComparison = [
    { week: 'Week 1', current: 185.2, previous: 201.3, goal: 170 },
    { week: 'Week 2', current: 169.7, previous: 195.8, goal: 170 },
    { week: 'Week 3', current: 178.3, previous: 188.4, goal: 170 },
    { week: 'Week 4', current: 162.1, previous: 176.9, goal: 170 },
  ];

  const achievements = [
    { title: 'Carbon Reducer', description: '7-day streak below target', icon: '🌱', achieved: true },
    { title: 'Public Transit Hero', description: '5+ transit trips this week', icon: '🚌', achieved: true },
    { title: 'Energy Saver', description: '20% reduction in energy use', icon: '⚡', achieved: false },
    { title: 'Eco Shopper', description: '3+ second-hand purchases', icon: '♻️', achieved: true },
  ];

  const insights = [
    {
      type: 'positive',
      title: 'Great Progress!',
      message: 'Your carbon footprint is 15% lower than last week. Transportation improvements are making a big impact.',
      icon: '📈'
    },
    {
      type: 'suggestion',
      title: 'Energy Opportunity',
      message: 'Your energy usage spikes on weekends. Consider adjusting thermostat settings when away.',
      icon: '💡'
    },
    {
      type: 'goal',
      title: 'Monthly Goal',
      message: 'You\'re 78% toward your monthly reduction goal. Keep up the momentum!',
      icon: '🎯'
    }
  ];

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Carbon Analytics</h1>
        <p className="text-gray-600 text-sm">Track your environmental impact and discover insights</p>
      </div>

      {/* Controls */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setTimeRange('7d')}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
            timeRange === '7d' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300'
          }`}
        >
          7 Days
        </button>
        <button
          onClick={() => setTimeRange('30d')}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
            timeRange === '30d' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300'
          }`}
        >
          30 Days
        </button>
        <button
          onClick={() => setTimeRange('90d')}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all ${
            timeRange === '90d' 
              ? 'bg-blue-600 text-white shadow-md' 
              : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-300'
          }`}
        >
          90 Days
        </button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total CO₂ This Week</p>
              <p className="text-lg font-bold text-gray-900">201.7 kg</p>
              <p className="text-xs text-green-600">↓ 15%</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <span className="text-lg">🌍</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Daily Average</p>
              <p className="text-lg font-bold text-gray-900">28.8 kg</p>
              <p className="text-xs text-green-600">↓ 2.1 kg</p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <span className="text-lg">📊</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Best Category</p>
              <p className="text-lg font-bold text-gray-900">Food</p>
              <p className="text-xs text-green-600">↓ 23%</p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <span className="text-lg">🍎</span>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Rank</p>
              <p className="text-lg font-bold text-gray-900">Top 15%</p>
              <p className="text-xs text-blue-600">Among users</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <span className="text-lg">🏆</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Carbon Footprint Trend */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Carbon Footprint Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={carbonTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                fontSize={12}
              />
              <YAxis fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value, name) => [`${value} kg CO₂`, name]}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#3B82F6" 
                fill="#3B82F6" 
                fillOpacity={0.1}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Category Breakdown</h3>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value} kg CO₂`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {categoryBreakdown.map((category) => (
              <div key={category.name} className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: category.color }}
                ></div>
                <span className="text-xs text-gray-700">{category.name}</span>
                <span className="text-xs font-medium text-gray-900">{category.value} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly Comparison */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">Weekly Progress vs Goal</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyComparison}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip formatter={(value) => `${value} kg CO₂`} />
            <Bar dataKey="goal" fill="#E5E7EB" name="Goal" />
            <Bar dataKey="previous" fill="#F3F4F6" name="Previous Period" />
            <Bar dataKey="current" fill="#3B82F6" name="Current Period" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Insights and Achievements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* AI Insights */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">AI Insights</h3>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${
                insight.type === 'positive' ? 'bg-green-50 border-green-400' :
                insight.type === 'suggestion' ? 'bg-blue-50 border-blue-400' :
                'bg-yellow-50 border-yellow-400'
              }`}>
                <div className="flex items-start gap-2">
                  <span className="text-lg">{insight.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{insight.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Achievements</h3>
          <div className="space-y-3">
            {achievements.map((achievement, index) => (
              <div key={index} className={`p-3 rounded-lg border ${
                achievement.achieved 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${
                      achievement.achieved ? 'text-green-900' : 'text-gray-500'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-xs ${
                      achievement.achieved ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;