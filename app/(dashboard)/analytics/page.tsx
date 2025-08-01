'use client'

import React, { useState, useEffect } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { 
  Globe, 
  BarChart3, 
  Apple, 
  Trophy, 
  TrendingUp, 
  Lightbulb, 
  Target, 
  Leaf, 
  Bus, 
  Zap, 
  ShoppingBag,
  CheckCircle,
  Circle,
  Activity,
  Calendar,
  Award,
  Hammer
} from 'lucide-react';

const AnalyticsPage = () => {
  const getMockData = () => ({
    carbonTrendData: [
      { date: '2025-07-05', transportation: 12.5, energy: 8.2, food: 6.1, shopping: 3.2, total: 30.0 },
      { date: '2025-07-06', transportation: 8.3, energy: 9.1, food: 7.2, shopping: 2.1, total: 26.7 },
      { date: '2025-07-07', transportation: 15.2, energy: 7.8, food: 5.9, shopping: 4.5, total: 33.4 },
      { date: '2025-07-08', transportation: 6.1, energy: 8.9, food: 6.8, shopping: 1.8, total: 23.6 },
      { date: '2025-07-09', transportation: 11.4, energy: 7.5, food: 6.2, shopping: 3.9, total: 29.0 },
      { date: '2025-07-10', transportation: 9.8, energy: 8.7, food: 5.4, shopping: 2.3, total: 26.2 },
      { date: '2025-07-11', transportation: 13.1, energy: 9.2, food: 6.7, shopping: 3.8, total: 32.8 },
    ],
    categoryBreakdown: [
      { name: 'Transportation', value: 76.4, percentage: 45.2, color: '#3B82F6' },
      { name: 'Energy', value: 59.4, percentage: 35.1, color: '#F59E0B' },
      { name: 'Food', value: 44.3, percentage: 26.2, color: '#10B981' },
      { name: 'Shopping', value: 21.6, percentage: 12.8, color: '#8B5CF6' },
    ],
    weeklyComparison: [
      { week: 'Week 1', current: 185.2, previous: 201.3, goal: 170 },
      { week: 'Week 2', current: 169.7, previous: 195.8, goal: 170 },
      { week: 'Week 3', current: 178.3, previous: 188.4, goal: 170 },
      { week: 'Week 4', current: 162.1, previous: 176.9, goal: 170 },
    ],
    achievements: [
      { title: 'Carbon Reducer', description: '7-day streak below target', icon: 'leaf', achieved: true },
      { title: 'Public Transit Hero', description: '5+ transit trips this week', icon: 'bus', achieved: true },
      { title: 'Energy Saver', description: '20% reduction in energy use', icon: 'zap', achieved: false },
      { title: 'Eco Shopper', description: '3+ second-hand purchases', icon: 'shopping', achieved: true },
    ],
    insights: [
      {
        type: 'positive',
        title: 'Great Progress!',
        message: 'Your carbon footprint is 15% lower than last week. Transportation improvements are making a big impact.',
        icon: 'trending'
      },
      {
        type: 'suggestion',
        title: 'Energy Opportunity',
        message: 'Your energy usage spikes on weekends. Consider adjusting thermostat settings when away.',
        icon: 'lightbulb'
      },
      {
        type: 'goal',
        title: 'Monthly Goal',
        message: 'You\'re 78% toward your monthly reduction goal. Keep up the momentum!',
        icon: 'target'
      }
    ],
    keyMetrics: {
      totalCarbon: 201.7,
      dailyAverage: 28.8,
      bestCategory: 'Food',
      rank: 'Top 15%'
    }
  });

  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState(getMockData());
  const [error, setError] = useState(null);
  
  // ML Prediction state
  const [mlPrediction, setMlPrediction] = useState(null);
  const [showPrediction, setShowPrediction] = useState(true);

  // Fetch ML prediction
  const fetchMLPrediction = async () => {
    try {
      const response = await fetch('/api/ml-predict');
      const data = await response.json();
      setMlPrediction(data);
    } catch (error) {
      console.error('Failed to fetch ML prediction:', error);
    }
  };

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        
        const result = await response.json();
        setAnalyticsData(result.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // @ts-expect-error error may not have a message property
        setError(error.message);
        
        // Fallback to mock data if API fails
        setAnalyticsData(getMockData());
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    fetchMLPrediction();
  }, [timeRange]);

  // Combine historical data with ML predictions
  const getCombinedData = () => {
    const { carbonTrendData } = analyticsData;
    //@ts-expect-error: carbonTrendData may not be defined
    if (!showPrediction || !mlPrediction?.predictions) {
      return carbonTrendData.map(d => ({ ...d, isPrediction: false }));
    }

    // Get last date from historical data
    const lastDate = new Date(carbonTrendData[carbonTrendData.length - 1]?.date || new Date());
    
    // Create prediction data points
    //@ts-expect-error: mlPrediction may not be defined
    const predictionData = mlPrediction.predictions.map((value, index) => {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + index + 1);
      
      return {
        date: futureDate.toISOString(),
        total: value,
        isPrediction: true
      };
    });

    // Combine historical + predictions
    return [
      ...carbonTrendData.map(d => ({ ...d, isPrediction: false })),
      ...predictionData
    ];
  };

  // Custom tooltip for chart
  // @ts-expect-error: CustomTooltip is not typed
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isPrediction = data.isPrediction;
      
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium text-gray-900">
            {new Date(label).toLocaleDateString()}
          </p>
          <p className="text-sm">
            <span className={isPrediction ? "text-emerald-600" : "text-blue-600"}>
              {`${payload[0].value.toFixed(2)} kg CO₂`}
            </span>
            {isPrediction && (
              <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                ML Predicted
              </span>
            )}
          </p>
          {isPrediction && mlPrediction && (
            <p className="text-xs text-gray-500 mt-1">
              {/* @ts-expect-error: mlPrediction is not typed */}
              🤖 Neural Network • {mlPrediction.accuracy}% accuracy
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Icon mapping function
  // @ts-expect-error iconName may not be a key of icons
  const getIcon = (iconName, className = "w-5 h-5") => {
    const icons = {
      globe: Globe,
      chart: BarChart3,
      apple: Apple,
      trophy: Trophy,
      trending: TrendingUp,
      lightbulb: Lightbulb,
      target: Target,
      leaf: Leaf,
      bus: Bus,
      zap: Zap,
      shopping: ShoppingBag,
      check: CheckCircle,
      circle: Circle,
      activity: Activity,
      calendar: Calendar,
      award: Award
    };
    // @ts-expect-error iconName may not be a key of icons
    const IconComponent = icons[iconName] || Activity;
    return <IconComponent className={className} />;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">{getIcon('circle', 'w-12 h-12 mx-auto')}</div>
          <p className="text-gray-600 font-medium mb-4">Failed to load analytics</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    categoryBreakdown,
    weeklyComparison,
    achievements,
    insights,
    keyMetrics
  } = analyticsData;

  const combinedData = getCombinedData();

  return (
    <div className="h-full overflow-auto bg-gradient-to-br from-emerald-50 to-blue-50">
      <div className="max-w-8xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {getIcon('activity', 'w-8 h-8 text-blue-600')}
            <h1 className="text-3xl font-bold text-gray-900">Carbon Analytics</h1>
          </div>
          <p className="text-gray-600">Track your environmental impact and discover actionable insights</p>
          {error && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              {getIcon('lightbulb', 'w-4 h-4 text-yellow-600')}
              <span className="text-yellow-800 text-sm font-medium">Using cached data. Some information may not be current.</span>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="mb-6 flex gap-2">
          {[
            { key: '7d', label: '7 Days' },
            { key: '30d', label: '30 Days' },
            { key: '90d', label: '90 Days' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTimeRange(key)}
              className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                timeRange === key 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 shadow-sm'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total CO₂ This Period</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.totalCarbon}</p>
                <p className="text-sm text-gray-500">kg CO₂</p>
                <div className="flex items-center gap-1 mt-2">
                  {getIcon('trending', 'w-4 h-4 text-green-600')}
                  <span className="text-sm text-green-600 font-medium">↓ 15%</span>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                {getIcon('globe', 'w-6 h-6 text-blue-600')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Daily Average</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.dailyAverage}</p>
                <p className="text-sm text-gray-500">kg CO₂</p>
                <div className="flex items-center gap-1 mt-2">
                  {getIcon('trending', 'w-4 h-4 text-green-600')}
                  <span className="text-sm text-green-600 font-medium">↓ 2.1 kg</span>
                </div>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                {getIcon('chart', 'w-6 h-6 text-green-600')}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Best Category</p>
                <p className="text-2xl font-bold text-gray-900">{keyMetrics.bestCategory}</p>
                <p className="text-sm text-gray-500">Lowest impact</p>
                <div className="flex items-center gap-1 mt-2">
                  {getIcon('trending', 'w-4 h-4 text-green-600')}
                  <span className="text-sm text-green-600 font-medium">↓ 23%</span>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-lg">
                {getIcon('ShoppingBag', 'w-6 h-6 text-amber-600')}
              </div>
            </div>
          </div>


          <div className="bg-gray-300 rounded-xl shadow-sm border border-gray-200 p-6 relative group">
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
              <Hammer size={14} /> Coming Soon
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Community Rank</p>
                <p className="text-2xl font-bold text-gray-500">{keyMetrics.rank}</p>
                <p className="text-sm text-gray-500">Among users</p>
                <div className="flex items-center gap-1 mt-2">
                  {getIcon('award', 'w-4 h-4 text-purple-600')}
                  <span className="text-sm text-purple-500 font-medium">Excellent</span>
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                {getIcon('trophy', 'w-6 h-6 text-purple-600')}
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Carbon Footprint Trend with ML Prediction */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {getIcon('trending', 'w-5 h-5 text-gray-700')}
                <h3 className="text-lg font-semibold text-gray-900">
                  Carbon Footprint Trend
                  {/* @ts-expect-error: mlPrediction is not typed */}
                  {mlPrediction?.accuracy > 0 && (
                    <span className="ml-2 text-sm font-normal text-emerald-600">
                      + AI Prediction
                    </span>
                  )}
                </h3>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* @ts-expect-error: mlPrediction is not typed */}
                {mlPrediction?.accuracy > 0 && (
                  <div className="text-xs text-gray-600">
                    <span className="font-medium text-emerald-600">
                      {/* @ts-expect-error: mlPrediction is not typed */}
                      🧠 {mlPrediction.accuracy}%
                    </span> ML accuracy
                  </div>
                )}
                {/* @ts-expect-error: mlPrediction is not typed */}
                {mlPrediction?.predictions && (
                  <button
                    onClick={() => setShowPrediction(!showPrediction)}
                    className={`px-3 py-1 text-xs rounded-full transition-colors ${
                      showPrediction 
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {showPrediction ? 'Hide' : 'Show'} ML Prediction
                  </button>
                )}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  fontSize={12}
                  stroke="#64748b"
                />
                <YAxis fontSize={12} stroke="#64748b" />
                {/* @ts-expect-error: CustomTooltip is not typed */}
                <Tooltip content={<CustomTooltip />} />
                
                {/* Historical Data */}
                <Area 
                  type="monotone" 
                  dataKey={(entry) => entry.isPrediction ? null : entry.total}
                  stroke="#3B82F6" 
                  fill="url(#colorBlue)"
                  strokeWidth={3}
                  connectNulls={false}
                />
                
                {/* ML Prediction Data */}
                {showPrediction && (
                  <Area 
                    type="monotone" 
                    dataKey={(entry) => entry.isPrediction ? entry.total : null}
                    stroke="#10B981"
                    fill="url(#colorGreen)"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    connectNulls={true}
                    //@ts-expect-error: dot is not typed
                    dot={(props) => {
                      if (!props.payload?.isPrediction) return null;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    const { key, dataKey, ...restProps } = props;
                      return (
                        // @ts-expect-error: restProps is not typed
                        <circle 
                          key={key}
                          {...restProps} 
                          r={3} 
                          fill="#10B981" 
                          stroke="#10B981" 
                          strokeWidth={2}
                        />
                      );
                    }}
                  />
                )}
                
                <defs>
                  <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.05}/>
                  </linearGradient>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>

            {/* ML Summary */}
            {/* @ts-expect-error: mlPrediction is not typed */}
            {showPrediction && mlPrediction?.predictions && (
              <div className="mt-4 bg-emerald-50 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-emerald-600 font-medium">7-Day Forecast:</span>
                      <span className="ml-1 font-semibold">
                        {/* @ts-expect-error: mlPrediction is not typed */}
                        {mlPrediction.predictions.reduce((sum, p) => sum + p, 0).toFixed(1)} kg CO₂
                      </span>
                    </div>
                    <div>
                      <span className="text-emerald-600 font-medium">Avg/Day:</span>
                      <span className="ml-1 font-semibold">
                        {/* @ts-expect-error: mlPrediction is not typed */}
                        {(mlPrediction.predictions.reduce((sum, p) => sum + p, 0) / 7).toFixed(1)} kg CO₂
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    🤖 Neural Network Prediction
                  </div>
                </div>
              </div>
            )}

            {/* Legend */}
            <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-2 bg-blue-500 rounded"></div>
                <span>Historical Data</span>
              </div>
              {/* @ts-expect-error: mlPrediction is not typed */}
              {showPrediction && mlPrediction?.predictions && (
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-2 bg-emerald-500 rounded opacity-60 border border-emerald-500 border-dashed"></div>
                  <span>ML Prediction</span>
                </div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              {getIcon('chart', 'w-5 h-5 text-gray-700')}
              <h3 className="text-lg font-semibold text-gray-900">Category Breakdown</h3>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `${value} kg CO₂`}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {categoryBreakdown.map((category) => (
                <div key={category.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm text-gray-700 font-medium">{category.name}</span>
                  <span className="text-sm font-bold text-gray-900 ml-auto">{category.value} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Comparison */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            {getIcon('calendar', 'w-5 h-5 text-gray-700')}
            <h3 className="text-lg font-semibold text-gray-900">Weekly Progress vs Goal</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="week" fontSize={12} stroke="#64748b" />
              <YAxis fontSize={12} stroke="#64748b" />
              <Tooltip 
                formatter={(value) => `${value} kg CO₂`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
              />
              <Bar dataKey="goal" fill="#E5E7EB" name="Goal" radius={[2, 2, 0, 0]} />
              <Bar dataKey="previous" fill="#94A3B8" name="Previous Period" radius={[2, 2, 0, 0]} />
              <Bar dataKey="current" fill="#3B82F6" name="Current Period" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Insights and Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative group">
          {/* AI Insights */}
          <div className="bg-gray-300 rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="absolute top-full right-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap flex items-center gap-2">
              <Hammer size={14} /> Coming Soon
            </div>
            <div className="flex items-center gap-2 mb-4">
              {getIcon('lightbulb', 'w-5 h-5 text-gray-500')}
              <h3 className="text-lg font-semibold text-gray-500">AI Insights</h3>
            </div>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'positive' ? 'bg-green-50 border-green-400' :
                  insight.type === 'suggestion' ? 'bg-blue-50 border-blue-400' :
                  'bg-amber-50 border-amber-400'
                }`}>
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'positive' ? 'bg-green-100' :
                      insight.type === 'suggestion' ? 'bg-blue-100' :
                      'bg-amber-100'
                    }`}>
                      {getIcon(insight.icon, `w-4 h-4 ${
                        insight.type === 'positive' ? 'text-green-600' :
                        insight.type === 'suggestion' ? 'text-blue-600' :
                        'text-amber-600'
                      }`)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-600">{insight.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gray-300 rounded-xl shadow-sm border border-gray-200 p-6">
            
            <div className="flex items-center gap-2 mb-4">
              {getIcon('award', 'w-5 h-5 text-gray-700')}
              <h3 className="text-lg font-semibold text-gray-500">Achievements</h3>
            </div>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  achievement.achieved 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.achieved ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {achievement.achieved 
                        ? getIcon('check', 'w-4 h-4 text-green-600')
                        : getIcon(achievement.icon, 'w-4 h-4 text-gray-400')
                      }
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-semibold text-sm ${
                        achievement.achieved ? 'text-green-900' : 'text-gray-500'
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className={`text-sm ${
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
    </div>
  );
};

export default AnalyticsPage;