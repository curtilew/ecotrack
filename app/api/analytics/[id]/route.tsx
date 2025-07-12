// app/api/analytics/[id]/route.ts
import { NextResponse } from 'next/server';
import { getUserByClerkID } from '@/utils/auth';
import { prisma } from '@/utils/db';

export async function GET(
  request: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const user = await getUserByClerkID();

    // Try to find the analysis in the Analysis table first
    let analysis = await prisma.analysis.findUnique({
      where: { id },
      include: {
        transportationLog: true,
        energyLog: true,
        foodLog: true,
        shoppingLog: true
      }
    });

    // If no analysis exists, create a basic one
    if (!analysis) {
      // Check if we can find a related log entry to create analysis for
      const [transportationLog, energyLog, foodLog, shoppingLog] = await Promise.all([
        prisma.transportationActivityLog.findUnique({ where: { id } }),
        prisma.energyActivityLog.findUnique({ where: { id } }),
        prisma.foodActivityLog.findUnique({ where: { id } }),
        prisma.shoppingActivityLog.findUnique({ where: { id } })
      ]);

      const relatedLog = transportationLog || energyLog || foodLog || shoppingLog;
      
      if (!relatedLog || relatedLog.userId !== user.id) {
        return NextResponse.json(
          { error: 'Analytics data not found' },
          { status: 404 }
        );
      }

      // Create basic analysis
      const carbonFootprint = relatedLog.carbonFootprint || estimateCarbonFootprint(relatedLog, getLogType(relatedLog));
      const recommendations = generateRecommendations(relatedLog, getLogType(relatedLog));
      
      analysis = {
        id,
        total: carbonFootprint,
        // @ts-expect-error logType may not be a key of relatedLog
        summary: `Analysis for ${getLogType(relatedLog)} activity`,
        recommendation: recommendations,
        relatedLog,
        logType: getLogType(relatedLog)
      };
    }

    return NextResponse.json({ data: analysis });

  } catch (error) {
    console.error('Analytics ID API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}
// @ts-expect-error log may not have a logType property
function getLogType(log) {
  if (log.activityType) return 'transportation';
  if (log.energyType) return 'energy';
  if (log.foodType) return 'food';
  if (log.category) return 'shopping';
  return 'unknown';
}
// @ts-expect-error log may have different shapes depending on logType
function estimateCarbonFootprint(log, logType) {
  switch (logType) {
    case 'transportation':
      const transportFactors = {
        'Car': 0.411, // kg CO2 per mile
        'Bike': 0,
        'Public Transit': 0.089,
        'Walking': 0,
        'Other': 0.2
      };
      // @ts-expect-error log.distance may not exist for all log types
      return (log.distance || 0) * (transportFactors[log.activityType] || 0.2);

    case 'energy':
      const energyFactors = {
        'Electricity': 0.707, // kg CO2 per kWh
        'Natural Gas': 0.184,
        'Heating Oil': 2.52,
        'Propane': 1.67,
        'Solar': 0,
        'Other': 0.5
      };
      // @ts-expect-error log.usage may not exist for all log types
      return (log.usage || 0) * (energyFactors[log.energyType] || 0.5);

    case 'food':
      const foodFactors = {
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
      // @ts-expect-error log.foodType may not exist for all log types
      return quantity * servingWeight * (foodFactors[log.foodType] || 2.5);

    case 'shopping':
      const baseFactor = 0.5; // kg CO2 per dollar
      const price = log.price || 10;
      const factor = log.isSecondHand ? baseFactor * 0.1 : baseFactor;
      return price * factor;

    default:
      return 0;
  }
}
// @ts-expect-error log may not have a logType property
function generateRecommendations(log, logType) {
  const recommendations = {
    transportation: {
      'Car': 'Consider carpooling, using public transit, or switching to electric/hybrid vehicles for future trips.',
      'Bike': 'Great choice! Biking is one of the most eco-friendly transportation options.',
      'Public Transit': 'Excellent! Public transit significantly reduces your carbon footprint.',
      'Walking': 'Perfect! Walking has zero carbon emissions and is great for your health.',
      'Other': 'Consider more eco-friendly transportation alternatives for similar trips.'
    },
    energy: {
      'Electricity': 'Try to use energy during off-peak hours and consider renewable energy options.',
      'Natural Gas': 'Improve insulation and consider a programmable thermostat to reduce usage.',
      'Heating Oil': 'Consider upgrading to more efficient heating systems or renewable alternatives.',
      'Propane': 'Use propane appliances efficiently and consider electric alternatives.',
      'Solar': 'Excellent choice! Solar energy is clean and renewable.',
      'Other': 'Look into renewable energy sources and energy-efficient appliances.'
    },
    food: {
      'Beef': 'Try reducing beef consumption or choosing grass-fed options. Consider plant-based alternatives.',
      'Pork': 'Consider reducing pork consumption and choosing locally sourced options.',
      'Chicken': 'Chicken has a lower carbon footprint than red meat. Choose free-range when possible.',
      'Fish': 'Choose sustainably caught fish and consider the transportation distance.',
      'Dairy': 'Consider plant-based milk alternatives and choose local dairy products.',
      'Vegetables': 'Great choice! Vegetables have a low carbon footprint, especially local and seasonal ones.',
      'Fruits': 'Excellent! Choose local and seasonal fruits when possible.',
      'Grains': 'Good choice! Grains are generally eco-friendly. Choose whole grains and local options.',
      'Processed Foods': 'Try to reduce processed foods and choose items with minimal packaging.',
      'Other': 'Consider the environmental impact and choose locally sourced options.'
    },
    shopping: {
      default: log?.isSecondHand 
        ? 'Excellent choice buying second-hand! This significantly reduces environmental impact.'
        : 'Consider buying second-hand, choosing durable items, or products with minimal packaging.'
    }
  };

  if (logType === 'shopping') {
    return recommendations.shopping.default;
  }
// @ts-expect-error logType may not be a key of recommendations
  const categoryRecs = recommendations[logType];
  const activityKey = log.activityType || log.energyType || log.foodType || 'Other';
  
  return categoryRecs?.[activityKey] || categoryRecs?.['Other'] || 'Keep tracking your activities to reduce your environmental impact!';
}