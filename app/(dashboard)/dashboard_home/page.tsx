// import EntryCard from "@/app/components/EntryCard"
// import EntryOptions from "@/app/components/EntryOptions"
// import { analyze } from "@/utils/ai"
// import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import Link from "next/link"
import EntryCard from "@/components/EntryCard"
import { getUserByClerkID } from "@/utils/auth"
// import CarbonFootprintChart from "@/components/Chart"
import { analyzeTotal } from "@/utils/ai"
import ImpactLevelVisualization from "@/components/ImpactLevel"


const getLogs = async () => {
    const user = await getUserByClerkID()
    
    // Fetch all log types
    const [transportationLogs, energyLogs, foodLogs, shoppingLogs] = await Promise.all([
        prisma.transportationActivityLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.energyActivityLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.foodActivityLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.shoppingActivityLog.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
        }),
    ])

    // Combine all logs with type information
    const allLogs = [
        ...transportationLogs.map(log => ({ ...log, logType: 'transportation' })),
        ...energyLogs.map(log => ({ ...log, logType: 'energy' })),
        ...foodLogs.map(log => ({ ...log, logType: 'food' })),
        ...shoppingLogs.map(log => ({ ...log, logType: 'shopping' })),
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

 
    return allLogs
}


// Simple Progress Bar Component
type SimpleProgressBarProps = {
    actual: number;
    goal?: number;
};

const SimpleProgressBar = ({ actual, goal = 50 }: SimpleProgressBarProps) => {
    const percentage = Math.min((actual / goal) * 100, 100);
    const isOver = actual > goal;
    
    return (
        <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Actual vs Goal</h3>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                    className={`h-3 rounded-full ${isOver ? 'bg-red-500' : percentage > 80 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-sm">
                <span>{(actual).toFixed(1)} kg CO₂</span>
                <span className="text-gray-500">Goal: {goal} kg</span>
            </div>
        </div>
    );
};


const getAIAnalysis = async (dateRange = 'today') => {
    try {
        const user = await getUserByClerkID();
        
        // Get today's date in user's local timezone 
        const today = new Date().toLocaleDateString('en-CA'); // Returns YYYY-MM-DD format
        
        // Calculate date filters based on the date range
        let dateFilter = {};
        
        switch (dateRange) {
            case 'today':
                dateFilter = {
                    date: {
                        gte: new Date(today + 'T00:00:00'),
                        lt: new Date(today + 'T23:59:59')
                    }
                };
                break;
                
            case 'week':
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                dateFilter = {
                    date: {
                        gte: weekAgo
                    }
                };
                break;
                
            case 'month':
                const monthAgo = new Date();
                monthAgo.setDate(monthAgo.getDate() - 30);
                dateFilter = {
                    date: {
                        gte: monthAgo
                    }
                };
                break;
                
            case 'all':
            default:
                // No date filtering
                dateFilter = {};
                break;
        }

        // Get logs with simple date filtering
        const [transportationLogs, energyLogs, foodLogs, shoppingLogs] = await Promise.all([
            prisma.transportationActivityLog.findMany({
                where: { 
                    userId: user.id,
                    ...dateFilter
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.energyActivityLog.findMany({
                where: { 
                    userId: user.id,
                    ...dateFilter
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.foodActivityLog.findMany({
                where: { 
                    userId: user.id,
                    ...dateFilter
                },
                orderBy: { createdAt: 'desc' },
            }),
            prisma.shoppingActivityLog.findMany({
                where: { 
                    userId: user.id,
                    ...dateFilter
                },
                orderBy: { createdAt: 'desc' },
            }),
        ]);

        // Format data for AI analysis
        const activityData = {
            transportation: transportationLogs,
            energy: energyLogs,
            food: foodLogs,
            shopping: shoppingLogs
        };

        // Get AI analysis
        const aiAnalysis = await analyzeTotal(JSON.stringify(activityData));
        
        return aiAnalysis;
    } catch (error) {
        console.error('Error getting AI analysis:', error);
        return {
            total: 0,
            breakdown: { transportation: 0, energy: 0, food: 0, shopping: 0 },
            confidence: 'low',
            methodology: 'Error occurred'
        } as {
            total: number;
            breakdown: {
                transportation: number;
                energy: number;
                food: number;
                shopping: number;
            };
            confidence: string;
            methodology: string;
        };
    }
};



// Updated function to get today's total from AI
const getTodaysTotalWithClientTimezone = async (userTimezone = 'est') => {
    const user = await getUserByClerkID();
    
    // Fallback to server timezone if client timezone not provided
    const timezone = userTimezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log('Using timezone:', timezone);
    
    // Get current date in specified timezone
    const now = new Date();
    const localTime = new Date(now.toLocaleString("en-US", {timeZone: timezone}));
    
    // Set to start of day (midnight) in user's timezone
    const today = new Date(localTime);
    today.setHours(0, 0, 0, 0);
    
    // Set to start of tomorrow (midnight) in user's timezone
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    try {
        // Get today's activities using user's local timezone dates
        const [transport, energy, food, shopping] = await Promise.all([
            prisma.transportationActivityLog.findMany({
                where: { 
                    userId: user.id, 
                    date: { 
                        gte: today
                        
                    } 
                }
            }),
            prisma.energyActivityLog.findMany({
                where: { 
                    userId: user.id, 
                    date: { 
                        gte: today
                     
                    } 
                }
            }),
            prisma.foodActivityLog.findMany({
                where: { 
                    userId: user.id, 
                    date: { 
                        gte: today
                       
                    } 
                }
            }),
            prisma.shoppingActivityLog.findMany({
                where: { 
                    userId: user.id, 
                    date: { 
                        gte: today 
                       
                    } 
                }
            })
        ]);

        // Format today's data for AI
        const todaysActivities = {
            transportation: transport,
            energy: energy,
            food: food,
            shopping: shopping
        };
        // console.log('Today\'s activities:', todaysActivities);
        // Get AI analysis for today's activities
        const aiAnalysis = await analyzeTotal(JSON.stringify(todaysActivities));
        
        return aiAnalysis.total || 0;
    } catch (error) {
        console.error('Error getting today\'s AI total:', error);
        return 0;
    }
};


const getYesterdayActivities = async () => {
    try {
        const user = await getUserByClerkID();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0, 0, 0, 0);
        const endOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59, 999);

        // Query all log types for yesterday only
        const [transport, energy, food, shopping] = await Promise.all([
            prisma.transportationActivityLog.findMany({
                where: { userId: user.id, date: { gte: startOfYesterday, lte: endOfYesterday } }
            }),
            prisma.energyActivityLog.findMany({
                where: { userId: user.id, date: { gte: startOfYesterday, lte: endOfYesterday } }
            }),
            prisma.foodActivityLog.findMany({
                where: { userId: user.id, date: { gte: startOfYesterday, lte: endOfYesterday } }
            }),
            prisma.shoppingActivityLog.findMany({
                where: { userId: user.id, date: { gte: startOfYesterday, lte: endOfYesterday } }
            })
        ]);

        const yesterdayActivities = {
            transportation: transport,
            energy: energy,
            food: food,
            shopping: shopping
        };
        // console.log('Yesterday\'s activities:', yesterdayActivities);
        // Get AI analysis for yesterday's activities
        const aiAnalysis = await analyzeTotal(JSON.stringify(yesterdayActivities));
        console.log('AI Analysis for yesterday:', aiAnalysis);
        return aiAnalysis.total || 0;
    } catch (error) {
        console.error('Error getting yesterday\'s AI total:', error);
        return 0;
    }
};

// Updated function to get breakdown from AI
const getRecentCarbonFootprints = async () => {
    try {
        const aiAnalysis = await getAIAnalysis();
        
        const breakdown = aiAnalysis.breakdown ?? { transportation: 0, energy: 0, food: 0, shopping: 0 };
        const {
            transportation = 0,
            energy = 0,
            food = 0,
            shopping = 0
        } = breakdown as { transportation?: number; energy?: number; food?: number; shopping?: number };
        return {
            transportation,
            energy,
            food,
            shopping
        };
    } catch (error) {
        console.error('Error getting AI carbon breakdown:', error);
        return {
            transportation: 0,
            energy: 0,
            food: 0,
            shopping: 0
        };
    }
};


// Updated ActivityPage component
const ActivityPage = async () => {
    const logs = await getLogs();
    
    // Get AI-powered data
    const [carbonData, todaysTotal, aiAnalysis] = await Promise.all([
        getRecentCarbonFootprints(),
        getTodaysTotalWithClientTimezone(),
        getAIAnalysis()
    ]);
    
    // const chartData = await getDailyCarbonByCategory(7);

    return (
        <div className="h-full flex flex-col bg-gradient-to-br from-emerald-50 to-blue-50">
            {/* Fixed Header */}
            <div className=" p-6 pb-4"></div>

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto px-6 pb-6">
                <div className="flex items-center gap-3 mb-2">
                {/* {getIcon('activity', 'w-8 h-8 text-blue-600')} */}
                <h1 className="text-3xl font-bold text-gray-900 pb-4">Dashboard</h1>
                </div>
                <div className="space-y-6">
                    {/* Main Dashboard Cards */}
                    <section className="flex justify-between gap-6">
                        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex-1">
                            <h2 className="text-xl font-medium mb-4 text-slate-700">Today&apos;s Activity</h2>
                            
                            {/* Goal progress bar */}
                            <div className="mb-4">
                                <SimpleProgressBar actual={todaysTotal}  goal={80} />
                            </div>
                            
                            <div className="mb-6">
                                <h3 className="text-base font-medium mb-3 text-slate-600">AI-Powered Breakdown</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                        <span className="text-slate-600">Transportation:</span>
                                        <span className="text-slate-500 font-mono text-sm">
                                            {carbonData.transportation > 0 ? `${carbonData.transportation.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                        <span className="text-slate-600">Food:</span>
                                        <span className="text-slate-500 font-mono text-sm">
                                            {carbonData.food > 0 ? `${carbonData.food.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                        <span className="text-slate-600">Energy:</span>
                                        <span className="text-slate-500 font-mono text-sm">
                                            {carbonData.energy > 0 ? `${carbonData.energy.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                        <span className="text-slate-600">Shopping:</span>
                                        <span className="text-slate-500 font-mono text-sm">
                                            {carbonData.shopping > 0 ? `${carbonData.shopping.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-medium mb-3 text-slate-600">AI Recommendations</h3>
                                <div className="bg-slate-50/60 p-3 rounded border border-slate-200/30">
                                    <div className="text-slate-600 text-sm">
                                        <div className="mb-2">
                                            <span className="font-medium">Calculation confidence:</span> 
                                            <span className={`ml-1 px-2 py-0.5 rounded text-xs ${
                                                aiAnalysis.confidence === 'high' ? 'bg-green-100 text-green-700' :
                                                aiAnalysis.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {aiAnalysis.confidence}
                                            </span>
                                        </div>
                                        <div className="text-slate-500">
                                            {aiAnalysis.methodology || 'Analyzing your carbon footprint patterns...'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex-1">
                            {/* <h2 className="text-xl font-medium mb-4 text-slate-700">Weekly Carbon Footprint</h2> */}
                            <div className="h-full">
                                {/* <CarbonFootprintChart aiAnalysis={aiAnalysis} /> */}
                                <ImpactLevelVisualization yesterdayData={await getYesterdayActivities()} />

                            </div>
                        </div>
                    </section>
                    
                    {/* Recent Activities Section */}
                    <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm">
                        <h3 className="text-xl font-medium mb-4 text-slate-700">Recent Activities</h3>
                        {logs.length > 0 ? (
                            <div className="flex flex-row gap-4 overflow-x-auto p-2">
                                {logs.map((log) => (
                                    <Link href={`/logupdate/${log.id}`} key={log.id}>
                                    <EntryCard
                                        // @ts-expect-error Database returns null but component expects undefined
                                        log={log}
                                        key={log.id}
                                    />
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="text-slate-300 mb-2 text-2xl">📊</div>
                                <p className="text-slate-500 mb-3">No activities logged yet. Start by adding your first activity!</p>
                                <Link href="/activitylog" className="inline-block px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors text-sm font-medium">
                                    Log Your First Activity
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivityPage