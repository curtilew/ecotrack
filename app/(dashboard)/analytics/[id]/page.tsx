'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, LineChart, Line } from 'recharts';

interface AnalyticsIdPageProps {
  params: {
    id: string;
  };
}
// ts-ignore error expected for dynamic log type lookup
interface AnalyticsData {
  // Core metrics
  total: number;
  summary?: string;
  recommendation?: string;
  logType?: string;
  
  // Related activity log data
  relatedLog?: {
    id: string;
    activityType: string;
    date: Date | string;
    carbonFootprint: number;
    distance?: number;        // for transportation
    usage?: number;           // for energy
    quantity?: number;        // for food/shopping
    unit?: string;
    note?: string;
  } | null;
  
  // Breakdown by categories
  breakdown?: {
    transportation: number;
    energy: number;
    food: number;
    shopping: number;
  };
  
  // Comparison data
  comparison?: {
    previousWeek?: number;
    previousMonth?: number;
    average?: number;
    percentChange?: number;
    trend?: 'up' | 'down' | 'stable';
  };
  
  // Historical trend data
  historicalData?: {
    date: string;
    value: number;
    carbonFootprint?: number;
  }[];
  
  // Optional: Keep the detailed fields for future use
  totalActivities?: number;
  totalCarbonFootprint?: number;
  weeklyReduction?: number;
  currentProgress?: number;
  progressPercentage?: number;
  monthlyGoal?: number;
}

const AnalyticsIdPage = ({ params }: AnalyticsIdPageProps) => {
  const { id } = params;
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  //ts-ignore
  // const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch specific analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/analytics/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Analytics data not found');
          }
          throw new Error('Failed to fetch analytics data');
        }
        
        const result = await response.json();
        setAnalyticsData(result.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
        // @ts-expect-error error may not have a 'message' property if not an Error object
        setError(error.message);
        
        // Fallback to mock data
        // @ts-expect-error error may not have a 'message' property
        setAnalyticsData(getMockAnalyticsData(id));
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAnalytics();
    }
  }, [id]);

  // Mock data generator for fallback
  const getMockAnalyticsData = (id: string) => ({
    id,
    total: 15.3,
    summary: `Detailed analysis for activity ${id}`,
    recommendation: 'Consider using public transportation or carpooling to reduce your carbon footprint.',
    logType: 'transportation',
    relatedLog: {
      activityType: 'Car',
      distance: 25,
      date: new Date().toISOString(),
      note: 'Daily commute to work'
    },
    breakdown: [
      { category: 'Direct Emissions', value: 12.1, percentage: 79 },
      { category: 'Indirect Emissions', value: 2.8, percentage: 18 },
      { category: 'Lifecycle Emissions', value: 0.4, percentage: 3 }
    ],
    comparison: [
      { metric: 'Your Activity', value: 15.3, color: '#3B82F6' },
      { metric: 'Category Average', value: 18.7, color: '#F59E0B' },
      { metric: 'Best Practice', value: 8.2, color: '#10B981' }
    ],
    historicalData: [
      { date: '2025-07-05', emissions: 16.2 },
      { date: '2025-07-06', emissions: 14.8 },
      { date: '2025-07-07', emissions: 17.1 },
      { date: '2025-07-08', emissions: 13.5 },
      { date: '2025-07-09', emissions: 15.9 },
      { date: '2025-07-10', emissions: 14.2 },
      { date: '2025-07-11', emissions: 15.3 }
    ]
  });

  const getActivityIcon = (logType: string) => {
    const icons = {
      transportation: '🚗',
      energy: '⚡',
      food: '🍎',
      shopping: '🛍️'
    };
    // @ts-expect-error logType may not be a key of icons, fallback to default icon
    return icons[logType] || '📊';
  };

  const getActivityTitle = (logType: string) => {
    const titles = {
      transportation: 'Transportation Activity',
      energy: 'Energy Usage',
      food: 'Food Consumption',
      shopping: 'Shopping Purchase'
    };
    // @ts-expect-error logType may not be a key of titles
    return titles[logType] || 'Activity';
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading detailed analytics...</p>
        </div>
      </div>
    );
  }

  if (error && !analyticsData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Analytics Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-3">
            <button 
              onClick={() => router.back()} 
              className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700"
            >
              Go Back
            </button>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

const {
  total = 0,
  summary = '',
  recommendation = '',
  logType = '',
  relatedLog = null,
  breakdown = {
    transportation: 0,
    energy: 0,
    food: 0,
    shopping: 0
  },
  comparison = {
    previousWeek: 0,
    previousMonth: 0,
    average: 0,
    percentChange: 0,
    trend: 'stable' as const
  },
  historicalData = []
} = analyticsData || {};

  return (
    <div className="h-full overflow-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ← Back
          </button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getActivityIcon(logType)}</span>
            <h1 className="text-2xl font-bold text-gray-900">Detailed Analytics</h1>
          </div>
        </div>
        <p className="text-gray-600 text-sm ml-14">{getActivityTitle(logType)} carbon footprint analysis</p>
        {error && (
          <div className="mt-2 ml-14 p-2 bg-yellow-100 border border-yellow-300 rounded text-yellow-800 text-xs">
            Using sample data. Real data could not be loaded.
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Total Carbon Footprint</p>
            <p className="text-3xl font-bold text-gray-900">{total}</p>
            <p className="text-sm text-gray-500">kg CO₂</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Category</p>
            <p className="text-2xl font-bold text-blue-600 capitalize">{logType}</p>
            <p className="text-sm text-gray-500">{getActivityTitle(logType)}</p>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 mb-1">Date</p>
            <p className="text-lg font-bold text-gray-900">
              {new Date(relatedLog?.date || Date.now()).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-500">Activity logged</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Emissions Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Emissions Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            {/* @ts-expect-error breakdown may not be an array */}
            <BarChart data={breakdown} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" fontSize={12} />
              <YAxis dataKey="category" type="category" fontSize={12} width={100} />
              <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
              <Bar dataKey="value" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={250}>
            {/* @ts-expect-error comparison may not be an array */}
            <BarChart data={comparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
              {/* @ts-expect-error: fill prop expects a string, but we are passing a function for dynamic color */}
              <Bar dataKey="value" fill={(entry) => entry.color || '#3B82F6'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Historical Trend */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">7-Day Historical Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              fontSize={12}
            />
            <YAxis fontSize={12} />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleDateString()}
              formatter={(value) => [`${value} kg CO₂`, 'Emissions']}
            />
            <Line 
              type="monotone" 
              dataKey="emissions" 
              stroke="#3B82F6" 
              strokeWidth={3}
              dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Details and Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Details</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Activity ID</span>
              <span className="text-sm text-gray-900 font-mono">{id}</span>
            </div>
            
            {relatedLog?.activityType && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Type</span>
                <span className="text-sm text-gray-900">{relatedLog.activityType}</span>
              </div>
            )}
            
            {relatedLog?.distance && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Distance</span>
                <span className="text-sm text-gray-900">{relatedLog.distance} miles</span>
              </div>
            )}
            
            {relatedLog?.usage && (
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-600">Usage</span>
                <span className="text-sm text-gray-900">{relatedLog.usage} {relatedLog.unit}</span>
              </div>
            )}
            
            {relatedLog?.note && (
              <div className="py-2">
                <span className="text-sm font-medium text-gray-600 block mb-1">Note</span>
                <span className="text-sm text-gray-900">{relatedLog.note}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Recommendations</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Personalized Suggestion</h4>
                  <p className="text-sm text-blue-800">{recommendation}</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h4 className="font-medium text-green-900 mb-2">Impact Summary</h4>
                  <p className="text-sm text-green-800">{summary}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsIdPage;