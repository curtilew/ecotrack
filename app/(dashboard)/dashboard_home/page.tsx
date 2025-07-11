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
        <div className="p-10 bg-zinc-400/10 h-full flex flex-col">
            <h2 className="text-3xl mb-8">Dashboard</h2>

            <section className="flex justify-between gap-4">
                <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow flex-1">
                    <h2 className="text-xl font-bold mb-4">Today's Impact</h2>
                    <div>Placeholder for daily Impact</div>
                    <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">Breakdown</h3>
                                <div className="space-y-1">
                                    <div className="flex justify-between">
                                        <span>Transportation:</span>
                                        <span className="text-gray-600">
                                            {carbonData.transportation > -1 ? `${carbonData.transportation.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Food:</span>
                                        <span className="text-gray-600">
                                            {carbonData.food > -1 ? `${carbonData.food.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Energy:</span>
                                        <span className="text-gray-600">
                                            {carbonData.energy > -1 ? `${carbonData.energy.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shopping:</span>
                                        <span className="text-gray-600">
                                            {carbonData.shopping > -1 ? `${carbonData.shopping.toFixed(2)} kg CO₂` : '--'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                    {/* Goal progress bar */}
                    <div className="mb-4">
                        <SimpleProgressBar actual={todaysTotal} goal={50} />
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
                        <div className="text-gray-600">Placeholder for AI Recommendations</div>
                    </div>
                </div>
                
                <div className="border border-gray-200 p-6 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow flex-1">
                    <h2 className="text-xl font-bold mb-4">Weekly Carbon Footprint</h2>
                    <CarbonFootprintChart data={chartData} />
                </div>
            </section>
            
            {/* Display all logs with proper routing */}
            <div className="mt-auto">
                <h3 className="text-2xl mb-4">Recent Activities</h3>
                {logs.length > 0 ? (
                    <div className="flex flex-row gap-4 overflow-x-auto">
                        {logs.map((log) => (
                            <Link href={getLogRoute(log)} key={log.id}>
                                <EntryCard log={log} />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No activities logged yet. Start by adding your first activity above!</p>
                )}
            </div>
        </div>
    )
    }

export default ActivityPage