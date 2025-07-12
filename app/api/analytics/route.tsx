// app/api/analytics/route.ts
import { NextResponse } from 'next/server';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || '7d';
    
    const user = await getUserByClerkID();
    
    // Calculate date range
    const now = new Date();
    const daysToSubtract = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
    const startDate = new Date(now.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));

    // Fetch all log types for the user within the time range
    const [transportationLogs, energyLogs, foodLogs, shoppingLogs] = await Promise.all([
      prisma.transportationActivityLog.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.energyActivityLog.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.foodActivityLog.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'asc' }
      }),
      prisma.shoppingActivityLog.findMany({
        where: {
          userId: user.id,
          createdAt: { gte: startDate }
        },
        orderBy: { createdAt: 'asc' }
      })
    ]);

    // Process data for analytics
    const analyticsData = processAnalyticsData({
      transportationLogs,
      energyLogs,
      foodLogs,
      shoppingLogs,
      timeRange,
      daysToSubtract
    });

    return NextResponse.json({ data: analyticsData });

  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function processAnalyticsData({ transportationLogs, energyLogs, foodLogs, shoppingLogs, timeRange, daysToSubtract }) {
  // Create daily aggregations
  const dailyData = {};
  const now = new Date();
  
  // Initialize daily data structure
  for (let i = 0; i < daysToSubtract; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dateKey = date.toISOString().split('T')[0];
    dailyData[dateKey] = {
      date: dateKey,
      transportation: 0,
      energy: 0,
      food: 0,
      shopping: 0,
      total: 0
    };
  }

  // Aggregate transportation data
  transportationLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateTransportationCarbon(log);
      dailyData[dateKey].transportation += carbon;
      dailyData[dateKey].total += carbon;
    }
  });

  // Aggregate energy data
  energyLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateEnergyCarbon(log);
      dailyData[dateKey].energy += carbon;
      dailyData[dateKey].total += carbon;
    }
  });

  // Aggregate food data
  foodLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateFoodCarbon(log);
      dailyData[dateKey].food += carbon;
      dailyData[dateKey].total += carbon;
    }
  });

  // Aggregate shopping data
  shoppingLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateShoppingCarbon(log);
      dailyData[dateKey].shopping += carbon;
      dailyData[dateKey].total += carbon;
    }
  });

  // Convert to array and sort by date
  const carbonTrendData = Object.values(dailyData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(day => ({
      ...day,
      transportation: Math.round(day.transportation * 10) / 10,
      energy: Math.round(day.energy * 10) / 10,
      food: Math.round(day.food * 10) / 10,
      shopping: Math.round(day.shopping * 10) / 10,
      total: Math.round(day.total * 10) / 10
    }));

  // Calculate category totals
  const categoryTotals = carbonTrendData.reduce((acc, day) => ({
    transportation: acc.transportation + day.transportation,
    energy: acc.energy + day.energy,
    food: acc.food + day.food,
    shopping: acc.shopping + day.shopping
  }), { transportation: 0, energy: 0, food: 0, shopping: 0 });

  const totalCarbon = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Create category breakdown
  const categoryBreakdown = [
    {
      name: 'Transportation',
      value: Math.round(categoryTotals.transportation * 10) / 10,
      percentage: Math.round((categoryTotals.transportation / totalCarbon) * 100 * 10) / 10,
      color: '#3B82F6'
    },
    {
      name: 'Energy',
      value: Math.round(categoryTotals.energy * 10) / 10,
      percentage: Math.round((categoryTotals.energy / totalCarbon) * 100 * 10) / 10,
      color: '#F59E0B'
    },
    {
      name: 'Food',
      value: Math.round(categoryTotals.food * 10) / 10,
      percentage: Math.round((categoryTotals.food / totalCarbon) * 100 * 10) / 10,
      color: '#10B981'
    },
    {
      name: 'Shopping',
      value: Math.round(categoryTotals.shopping * 10) / 10,
      percentage: Math.round((categoryTotals.shopping / totalCarbon) * 100 * 10) / 10,
      color: '#8B5CF6'
    }
  ].sort((a, b) => b.value - a.value);

  // Generate weekly comparison (mock data for now)
  const weeklyComparison = generateWeeklyComparison(totalCarbon, daysToSubtract);

  // Generate achievements
  const achievements = generateAchievements({
    transportationLogs,
    energyLogs,
    foodLogs,
    shoppingLogs,
    categoryTotals
  });

  // Generate insights
  const insights = generateInsights({
    carbonTrendData,
    categoryTotals,
    totalCarbon,
    timeRange
  });

  // Calculate key metrics
  const dailyAverage = Math.round((totalCarbon / daysToSubtract) * 10) / 10;
  const bestCategory = categoryBreakdown[categoryBreakdown.length - 1]?.name || 'Energy';

  return {
    carbonTrendData,
    categoryBreakdown,
    weeklyComparison,
    achievements,
    insights,
    keyMetrics: {
      totalCarbon: Math.round(totalCarbon * 10) / 10,
      dailyAverage,
      bestCategory,
      rank: 'Top 15%' // Mock data
    }
  };
}

// Carbon estimation functions
function estimateTransportationCarbon(log) {
  const factors = {
    'Car': 0.411, // kg CO2 per mile
    'Bike': 0,
    'Public Transit': 0.089,
    'Walking': 0,
    'Other': 0.2
  };
  return (log.distance || 0) * (factors[log.activityType] || 0.2);
}

function estimateEnergyCarbon(log) {
  const factors = {
    'Electricity': 0.707, // kg CO2 per kWh
    'Natural Gas': 0.184, // kg CO2 per kWh equivalent
    'Heating Oil': 2.52,
    'Propane': 1.67,
    'Solar': 0,
    'Other': 0.5
  };
  return (log.usage || 0) * (factors[log.energyType] || 0.5);
}

function estimateFoodCarbon(log) {
  const factors = {
    'Beef': 27, // kg CO2 per kg
    'Pork': 12.1,
    'Chicken': 6.9,
    'Fish': 6.1,
    'Dairy': 3.2,
    'Vegetables': 2.0,
    'Fruits': 1.1,
    'Grains': 1.4,
    'Processed Foods': 3.8,
    'Other': 2.5
  };
  const quantity = log.quantity || 1;
  const servingWeight = 0.25; // Assume 0.25 kg per serving
  return quantity * servingWeight * (factors[log.foodType] || 2.5);
}

function estimateShoppingCarbon(log) {
  const baseFactor = 0.5; // kg CO2 per dollar
  const price = log.price || 10;
  const factor = log.isSecondHand ? baseFactor * 0.1 : baseFactor; // 90% less for second-hand
  return price * factor;
}

function generateWeeklyComparison(totalCarbon, daysToSubtract) {
  const weeksCount = Math.ceil(daysToSubtract / 7);
  const weeklyAverage = totalCarbon / weeksCount;
  const goal = weeklyAverage * 0.85; // 15% reduction goal
  
  return Array.from({ length: Math.min(weeksCount, 4) }, (_, i) => ({
    week: `Week ${i + 1}`,
    current: Math.round((weeklyAverage * (0.9 + Math.random() * 0.2)) * 10) / 10,
    previous: Math.round((weeklyAverage * (1.0 + Math.random() * 0.2)) * 10) / 10,
    goal: Math.round(goal * 10) / 10
  }));
}

function generateAchievements({ transportationLogs, energyLogs, foodLogs, shoppingLogs, categoryTotals }) {
  const transitTrips = transportationLogs.filter(log => log.activityType === 'Public Transit').length;
  const secondHandPurchases = shoppingLogs.filter(log => log.isSecondHand).length;
  const energyEfficient = categoryTotals.energy < 50; // Arbitrary threshold
  const consistentLogging = (transportationLogs.length + energyLogs.length + foodLogs.length + shoppingLogs.length) >= 7;

  return [
    {
      title: 'Carbon Reducer',
      description: '7-day streak below target',
      icon: '🌱',
      achieved: consistentLogging
    },
    {
      title: 'Public Transit Hero',
      description: '5+ transit trips this week',
      icon: '🚌',
      achieved: transitTrips >= 5
    },
    {
      title: 'Energy Saver',
      description: '20% reduction in energy use',
      icon: '⚡',
      achieved: energyEfficient
    },
    {
      title: 'Eco Shopper',
      description: '3+ second-hand purchases',
      icon: '♻️',
      achieved: secondHandPurchases >= 3
    }
  ];
}

function generateInsights({ carbonTrendData, categoryTotals, totalCarbon, timeRange }) {
  const insights = [];
  
  // Trend analysis
  if (carbonTrendData.length >= 2) {
    const recent = carbonTrendData.slice(-3).reduce((sum, day) => sum + day.total, 0) / 3;
    const earlier = carbonTrendData.slice(0, 3).reduce((sum, day) => sum + day.total, 0) / 3;
    const improvement = ((earlier - recent) / earlier) * 100;
    
    if (improvement > 5) {
      insights.push({
        type: 'positive',
        title: 'Great Progress!',
        message: `Your carbon footprint is ${Math.round(improvement)}% lower than earlier this period. Keep up the great work!`,
        icon: '📈'
      });
    }
  }
  
  // Category-specific insights
  const sortedCategories = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a);
  const highestCategory = sortedCategories[0][0];
  
  insights.push({
    type: 'suggestion',
    title: `${highestCategory.charAt(0).toUpperCase() + highestCategory.slice(1)} Opportunity`,
    message: `${highestCategory.charAt(0).toUpperCase() + highestCategory.slice(1)} is your highest impact category. Small changes here can make a big difference.`,
    icon: '💡'
  });
  
  // Goal progress
  const targetReduction = totalCarbon * 0.85; // 15% reduction goal
  const progress = ((totalCarbon - targetReduction) / totalCarbon) * 100;
  
  insights.push({
    type: 'goal',
    title: 'Reduction Goal',
    message: `You're making progress toward your reduction target. Consider focusing on your top impact areas.`,
    icon: '🎯'
  });
  
  return insights.slice(0, 3); // Return max 3 insights
}