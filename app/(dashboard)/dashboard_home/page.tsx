// import EntryCard from "@/app/components/EntryCard"
// import EntryOptions from "@/app/components/EntryOptions"
// import { analyze } from "@/utils/ai"
// import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import Link from "next/link"
import EntryCard from "@/components/EntryCard"
import { getUserByClerkID } from "@/utils/auth"
import CarbonFootprintChart from "@/components/Chart"



const getLogRoute = (log) => {
        // Route to the appropriate log detail page based on log type
        const routeMap = {
            'transportation': `/activitylog/transportation/${log.id}`,
            'energy': `/activitylog/energy/${log.id}`,
            'food': `/activitylog/food/${log.id}`,
            'shopping': `/activitylog/shopping/${log.id}`,
        }
        return routeMap[log.logType] || `/activitylog/${log.id}`
    }

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
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return allLogs
}


//Gets the breakdown of carbon footprint by category
const getRecentCarbonFootprints = async () => {
    const user = await getUserByClerkID();
    
    // Get most recent log from each category
    const [transportationLogs, energyLogs, foodLogs, shoppingLogs] = await Promise.all([
        prisma.transportationActivityLog.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: { carbonFootprint: true }
        }),
        prisma.energyActivityLog.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: { carbonFootprint: true }
        }),
        prisma.foodActivityLog.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: { carbonFootprint: true }
        }),
        prisma.shoppingActivityLog.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            select: { carbonFootprint: true }
        })
    ]);

    return {
        transportation: transportationLogs?.carbonFootprint || 0,
        energy: energyLogs?.carbonFootprint || 0,
        food: foodLogs?.carbonFootprint || 0,
        shopping: shoppingLogs?.carbonFootprint || 0
    };
};


// gets total carbonfootprint for the day
const getTodaysTotal = async () => {
    const user = await getUserByClerkID();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [transport, energy, food, shopping] = await Promise.all([
        prisma.transportationActivityLog.aggregate({
            where: { userId: user.id, date: { gte: today, lt: tomorrow } },
            _sum: { carbonFootprint: true }
        }),
        prisma.energyActivityLog.aggregate({
            where: { userId: user.id, date: { gte: today, lt: tomorrow } },
            _sum: { carbonFootprint: true }
        }),
        prisma.foodActivityLog.aggregate({
            where: { userId: user.id, date: { gte: today, lt: tomorrow } },
            _sum: { carbonFootprint: true }
        }),
        prisma.shoppingActivityLog.aggregate({
            where: { userId: user.id, date: { gte: today, lt: tomorrow } },
            _sum: { carbonFootprint: true }
        })
    ]);

    return (transport._sum.carbonFootprint || 0) + 
           (energy._sum.carbonFootprint || 0) + 
           (food._sum.carbonFootprint || 0) + 
           (shopping._sum.carbonFootprint || 0);
};

// Simple Progress Bar Component
const SimpleProgressBar = ({ actual, goal = 50 }) => {
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
                <span>{actual.toFixed(1)} kg CO₂</span>
                <span className="text-gray-500">Goal: {goal} kg</span>
            </div>
        </div>
    );
};


//Chart DATA
const getDailyCarbonByCategory = async (days = 7) => {
    const user = await getUserByClerkID();
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [transport, energy, food, shopping] = await Promise.all([
        prisma.transportationActivityLog.findMany({
            where: { userId: user.id, date: { gte: startDate, lte: endDate, not: null } },
            select: { date: true, carbonFootprint: true }
        }),
        prisma.energyActivityLog.findMany({
            where: { userId: user.id, date: { gte: startDate, lte: endDate, not: null } },
            select: { date: true, carbonFootprint: true }
        }),
        prisma.foodActivityLog.findMany({
            where: { userId: user.id, date: { gte: startDate, lte: endDate, not: null } },
            select: { date: true, carbonFootprint: true }
        }),
        prisma.shoppingActivityLog.findMany({
            where: { userId: user.id, date: { gte: startDate, lte: endDate, not: null } },
            select: { date: true, carbonFootprint: true }
        })
    ]);

    // Group by date
    const dailyData = {};
    
    transport.forEach(log => {
        const date = log.date.toISOString().split('T')[0];
        if (!dailyData[date]) dailyData[date] = { transport: 0, energy: 0, food: 0, shopping: 0 };
        dailyData[date].transport += log.carbonFootprint || 0;
    });
    
    energy.forEach(log => {
        const date = log.date.toISOString().split('T')[0];
        if (!dailyData[date]) dailyData[date] = { transport: 0, energy: 0, food: 0, shopping: 0 };
        dailyData[date].energy += log.carbonFootprint || 0;
    });
    
    food.forEach(log => {
        const date = log.date.toISOString().split('T')[0];
        if (!dailyData[date]) dailyData[date] = { transport: 0, energy: 0, food: 0, shopping: 0 };
        dailyData[date].food += log.carbonFootprint || 0;
    });
    
    shopping.forEach(log => {
        const date = log.date.toISOString().split('T')[0];
        if (!dailyData[date]) dailyData[date] = { transport: 0, energy: 0, food: 0, shopping: 0 };
        dailyData[date].shopping += log.carbonFootprint || 0;
    });

    return Object.entries(dailyData)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, data]) => ({
            date,
            ...data
        }));
};



const ActivityPage = async () => {
    const logs = await getLogs()
    const carbonData = await getRecentCarbonFootprints();
    const todaysTotal = await getTodaysTotal();
    const chartData = await getDailyCarbonByCategory(7);
    

    return (
            <div className="h-full flex flex-col bg-slate-50/30">
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-6 pb-4">
                    <h2 className="text-3xl mb-6 font-medium text-slate-700">Dashboard</h2>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-auto px-6 pb-6">
                    <div className="space-y-6">
                        {/* Main Dashboard Cards */}
                        <section className="flex justify-between gap-6">
                            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex-1">
                                <h2 className="text-xl font-medium mb-4 text-slate-700">Today's Impact</h2>
                                
                                {/* Goal progress bar */}
                                <div className="mb-4">
                                    <SimpleProgressBar actual={todaysTotal} goal={50} />
                                </div>
                                
                                <div className="mb-6">
                                    <h3 className="text-base font-medium mb-3 text-slate-600">Breakdown</h3>
                                    <div className="space-y-1">
                                        <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                            <span className="text-slate-600">Transportation:</span>
                                            <span className="text-slate-500 font-mono text-sm">
                                                {carbonData.transportation > -1 ? `${carbonData.transportation.toFixed(2)} kg CO₂` : '--'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                            <span className="text-slate-600">Food:</span>
                                            <span className="text-slate-500 font-mono text-sm">
                                                {carbonData.food > -1 ? `${carbonData.food.toFixed(2)} kg CO₂` : '--'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                            <span className="text-slate-600">Energy:</span>
                                            <span className="text-slate-500 font-mono text-sm">
                                                {carbonData.energy > -1 ? `${carbonData.energy.toFixed(2)} kg CO₂` : '--'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1.5 px-2 rounded hover:bg-slate-50/80 transition-colors">
                                            <span className="text-slate-600">Shopping:</span>
                                            <span className="text-slate-500 font-mono text-sm">
                                                {carbonData.shopping > -1 ? `${carbonData.shopping.toFixed(2)} kg CO₂` : '--'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-base font-medium mb-3 text-slate-600">Recommendations</h3>
                                    <div className="bg-slate-50/60 p-3 rounded border border-slate-200/30">
                                        <div className="text-slate-500 text-sm">AI recommendations coming soon...</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="bg-white/70 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex-1">
                                <h2 className="text-xl font-medium mb-4 text-slate-700">Weekly Carbon Footprint</h2>
                                <div className="h-64">
                                    <CarbonFootprintChart data={chartData} />
                                </div>
                            </div>
                        </section>
                        
                        {/* Recent Activities Section */}
                        <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 p-6 rounded-lg shadow-sm">
                            <h3 className="text-xl font-medium mb-4 text-slate-700">Recent Activities</h3>
                            {logs.length > 0 ? (
                                <div className="flex flex-row gap-4 overflow-x-auto pb-2">
                                    {logs.map((log) => (
                                        <Link href={getLogRoute(log)} key={log.id}>
                                            <EntryCard log={log} />
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