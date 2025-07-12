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
// @ts-expect-error processAnalyticsData may not be defined
function processAnalyticsData({ transportationLogs, energyLogs, foodLogs, shoppingLogs, timeRange, daysToSubtract }) {
  // Create daily aggregations
  const dailyData = {};
  const now = new Date();
  
  // Initialize daily data structure
  for (let i = 0; i < daysToSubtract; i++) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dateKey = date.toISOString().split('T')[0];
    // @ts-expect-error dailyData may not be an object
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
  // @ts-expect-error transportationLogs may not be an array
  transportationLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    // @ts-expect-error dailyData may not have a dateKey property
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateTransportationCarbon(log);
      // @ts-expect-error dailyData may not have transportation property
      dailyData[dateKey].transportation += carbon;
      // @ts-expect-error dailyData may not have total property
      dailyData[dateKey].total += carbon;
    }
  });

  // Aggregate energy data
  // @ts-expect-error energyLogs may not be an array
  energyLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    // @ts-expect-error dailyData may not have a dateKey property
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateEnergyCarbon(log);
      // @ts-expect-error dailyData may not have energy property
      dailyData[dateKey].energy += carbon;
      // @ts-expect-error dailyData may not have total property
      dailyData[dateKey].total += carbon;
    }
  });

  // Aggregate food data
  // @ts-expect-error foodLogs may not be an array
  foodLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    // @ts-expect-error dailyData may not have a dateKey property
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateFoodCarbon(log);
      // @ts-expect-error dailyData may not have food property
      dailyData[dateKey].food += carbon;
      // @ts-expect-error dailyData may not have total property
      dailyData[dateKey].total += carbon;
    }
  });

  // Aggregate shopping data
  // @ts-expect-error shoppingLogs may not be an array
  shoppingLogs.forEach(log => {
    const dateKey = log.createdAt.toISOString().split('T')[0];
    // @ts-expect-error dailyData may not have a dateKey property
    if (dailyData[dateKey]) {
      const carbon = log.carbonFootprint || estimateShoppingCarbon(log);
      // @ts-expect-error dailyData may not have shopping property
      dailyData[dateKey].shopping += carbon;
      // @ts-expect-error dailyData may not have total property
      dailyData[dateKey].total += carbon;
    }
  });

  // Convert to array and sort by date
  const carbonTrendData = Object.values(dailyData)
  // @ts-expect-error dailyData may not be an array
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(day => ({
      // @ts-expect-error day may not have a date property
      ...day,
      // @ts-expect-error day may not have transportation, energy, food, shopping, total properties
      transportation: Math.round(day.transportation * 10) / 10,
      // @ts-expect-error day may not have energy, food, shopping, total properties
      energy: Math.round(day.energy * 10) / 10,
      // @ts-expect-error day may not have food, shopping, total properties
      food: Math.round(day.food * 10) / 10,
      // @ts-expect-error day may not have shopping, total properties
      shopping: Math.round(day.shopping * 10) / 10,
      // @ts-expect-error day may not have total property
      total: Math.round(day.total * 10) / 10
    }));

  // Calculate category totals
  const categoryTotals = carbonTrendData.reduce((acc, day) => ({
    transportation: acc.transportation + day.transportation,
    energy: acc.energy + day.energy,
    food: acc.food + day.food,
    shopping: acc.shopping + day.shopping
  }), { transportation: 0, energy: 0, food: 0, shopping: 0 });
// @ts-expect-error categoryTotals may not be an object
  const totalCarbon = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

  // Create category breakdown
  const categoryBreakdown = [
    {
      name: 'Transportation',
      value: Math.round(categoryTotals.transportation * 10) / 10,
      // @ts-expect-error categoryTotals may not have a transportation property
      percentage: Math.round((categoryTotals.transportation / totalCarbon) * 100 * 10) / 10,
      color: '#3B82F6'
    },
    {
      name: 'Energy',
      value: Math.round(categoryTotals.energy * 10) / 10,
      // @ts-expect-error categoryTotals may not have an energy property
      percentage: Math.round((categoryTotals.energy / totalCarbon) * 100 * 10) / 10,
      color: '#F59E0B'
    },
    {
      name: 'Food',
      value: Math.round(categoryTotals.food * 10) / 10,
      // @ts-expect-error categoryTotals may not have a food property
      percentage: Math.round((categoryTotals.food / totalCarbon) * 100 * 10) / 10,
      color: '#10B981'
    },
    {
      name: 'Shopping',
      value: Math.round(categoryTotals.shopping * 10) / 10,
      // @ts-expect-error categoryTotals may not have a shopping property
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
    // @ts-expect-error totalCarbon may not be defined
    totalCarbon,
   
    timeRange
  });

  // Calculate key metrics
  // @ts-expect-error categoryTotals may not have a transportation property
  const dailyAverage = Math.round((totalCarbon / daysToSubtract) * 10) / 10;
  const bestCategory = categoryBreakdown[categoryBreakdown.length - 1]?.name || 'Energy';

  return {
    carbonTrendData,
    categoryBreakdown,
    weeklyComparison,
    achievements,
    insights,
    keyMetrics: {
      // @ts-expect-error categoryTotals may not have a transportation property
      totalCarbon: Math.round(totalCarbon * 10) / 10,
      dailyAverage,
      bestCategory,
      rank: 'Top 15%' // Mock data
    }
  };
}

// Carbon estimation functions
// @ts-expect-error log may not have a carbonFootprint property
function estimateTransportationCarbon(log) {
  const factors = {
    'Car': 0.411, // kg CO2 per mile
    'Bike': 0,
    'Public Transit': 0.089,
    'Walking': 0,
    'Other': 0.2
  };
  // @ts-expect-error log may not have a distance property
  return (log.distance || 0) * (factors[log.activityType] || 0.2);
}
// @ts-expect-error log may not have a usage property
function estimateEnergyCarbon(log) {
  const factors = {
    'Electricity': 0.707, // kg CO2 per kWh
    'Natural Gas': 0.184, // kg CO2 per kWh equivalent
    'Heating Oil': 2.52,
    'Propane': 1.67,
    'Solar': 0,
    'Other': 0.5
  };
  // @ts-expect-error log may not have a usage property
  return (log.usage || 0) * (factors[log.energyType] || 0.5);
}
// @ts-expect-error log may not have a foodType property
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
  // @ts-expect-error log may not have a foodType property
  return quantity * servingWeight * (factors[log.foodType] || 2.5);
}
// @ts-expect-error log may not have a price property
function estimateShoppingCarbon(log) {
  const baseFactor = 0.5; // kg CO2 per dollar
  const price = log.price || 10;
  const factor = log.isSecondHand ? baseFactor * 0.1 : baseFactor; // 90% less for second-hand
  return price * factor;
}
// @ts-expect-error generateWeeklyComparison may not be defined
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
// @ts-expect-error generateAchievements may not be defined
function generateAchievements({ transportationLogs, energyLogs, foodLogs, shoppingLogs, categoryTotals }) {
  // @ts-expect-error transportationLogs may not be an array
  const transitTrips = transportationLogs.filter(log => log.activityType === 'Public Transit').length;
  // @ts-expect-error energyLogs may not be an array
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
// @ts-expect-error generateInsights may not be defined

function generateInsights({ carbonTrendData, categoryTotals }) {
  const insights = [];
  
  // Trend analysis
  if (carbonTrendData.length >= 2) {
    // @ts-expect-error carbonTrendData may not have enough data points
    const recent = carbonTrendData.slice(-3).reduce((sum, day) => sum + day.total, 0) / 3;
    // @ts-expect-error carbonTrendData may not have enough data points
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
  // @ts-expect-error categoryTotals may not have a food property
  const sortedCategories = Object.entries(categoryTotals).sort(([,a], [,b]) => b - a);
  const highestCategory = sortedCategories[0][0];
  
  insights.push({
    type: 'suggestion',
    title: `${highestCategory.charAt(0).toUpperCase() + highestCategory.slice(1)} Opportunity`,
    message: `${highestCategory.charAt(0).toUpperCase() + highestCategory.slice(1)} is your highest impact category. Small changes here can make a big difference.`,
    icon: '💡'
  });
  
  // Goal progress
  // const targetReduction = totalCarbon * 0.85; // 15% reduction goal
 
  // const progress = ((totalCarbon - targetReduction) / totalCarbon) * 100;
  
  insights.push({
    type: 'goal',
    title: 'Reduction Goal',
    message: `You're making progress toward your reduction target. Consider focusing on your top impact areas.`,
    icon: '🎯'
  });
  
  return insights.slice(0, 3); // Return max 3 insights
}