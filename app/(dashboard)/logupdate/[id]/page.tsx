
import Editor from "@/components/Editor";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getEntry = async (id) => {
    const user = await getUserByClerkID();
    
    // Try each log type to find the entry
    let entry = null;
    let logType = null;
    
    // Check transportation logs
    entry = await prisma.transportationActivityLog.findFirst({
        where: {
            userId: user.id,
            id: id,
        },
    });
    if (entry) {
        logType = 'transportation';
        return { ...entry, logType };
    }
    
    // Check energy logs
    entry = await prisma.energyActivityLog.findFirst({
        where: {
            userId: user.id,
            id: id,
        },
    });
    if (entry) {
        logType = 'energy';
        return { ...entry, logType };
    }
    
    // Check food logs
    entry = await prisma.foodActivityLog.findFirst({
        where: {
            userId: user.id,
            id: id,
        },
    });
    if (entry) {
        logType = 'food';
        return { ...entry, logType };
    }
    
    // Check shopping logs
    entry = await prisma.shoppingActivityLog.findFirst({
        where: {
            userId: user.id,
            id: id,
        },
    });
    if (entry) {
        logType = 'shopping';
        return { ...entry, logType };
    }
    
    return null;
}

const EntryPage = async ({ params }) => {
    const { id } = await params;
    const entry = await getEntry(id);
    
    if (!entry) {
        return (
            <div className="h-full w-full flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Entry Not Found</h2>
                    <p className="text-gray-500">The activity you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    // Dynamic analysis data based on log type
    const getAnalysisData = (entry) => {
        const baseData = [
            { name: 'Date', value: entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A' },
            { name: 'Created', value: new Date(entry.createdAt).toLocaleDateString() },
        ];

        switch (entry.logType) {
            case 'transportation':
                return [
                    ...baseData,
                    { name: 'Type', value: entry.activityType || 'N/A' },
                    { name: 'Distance', value: entry.distance ? `${entry.distance} miles` : 'N/A' },
                    { name: 'CO₂ Impact', value: entry.carbonFootprint ? `${entry.carbonFootprint} kg` : 'N/A' },
                ];
            case 'energy':
                return [
                    ...baseData,
                    { name: 'Type', value: entry.energyType || 'N/A' },
                    { name: 'Usage', value: entry.usage ? `${entry.usage} ${entry.unit || ''}` : 'N/A' },
                    { name: 'CO₂ Impact', value: entry.carbonFootprint ? `${entry.carbonFootprint} kg` : 'N/A' },
                ];
            case 'food':
                return [
                    ...baseData,
                    { name: 'Food', value: entry.foodType || 'N/A' },
                    { name: 'Quantity', value: entry.quantity ? `${entry.quantity} ${entry.unit || ''}` : 'N/A' },
                    { name: 'Meal', value: entry.mealType || 'N/A' },
                    { name: 'CO₂ Impact', value: entry.carbonFootprint ? `${entry.carbonFootprint} kg` : 'N/A' },
                ];
            case 'shopping':
                return [
                    ...baseData,
                    { name: 'Item', value: entry.itemName || 'N/A' },
                    { name: 'Category', value: entry.category || 'N/A' },
                    { name: 'Price', value: entry.price ? `$${entry.price}` : 'N/A' },
                    { name: 'Second-hand', value: entry.isSecondHand ? 'Yes' : 'No' },
                    { name: 'CO₂ Impact', value: entry.carbonFootprint ? `${entry.carbonFootprint} kg` : 'N/A' },
                ];
            default:
                return baseData;
        }
    };

    const analysisData = getAnalysisData(entry);

    return (
        <div className="h-full w-full grid grid-cols-3">
            <div className="col-span-2 bg-white">
                {/* Header for Editor Section */}
                <div className=" bg-emerald-400 px-8 py-6 rounded-t-xl">
                    <h1 className="text-xl font-medium text-white">Edit Activity</h1>
                    <p className="text-emerald-100 text-sm mt-1 font-light">
                        Update your {entry.logType} activity details
                    </p>
                </div>
                <Editor log={entry} />
            </div>
            <div className="bg-white shadow-sm rounded-xl m-4">
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-6 rounded-t-xl">
                    <h2 className="text-xl font-medium text-white">
                        Activity Summary
                    </h2>
                    <p className="text-emerald-100 text-sm mt-1 font-light">
                        {entry.logType.charAt(0).toUpperCase() + entry.logType.slice(1)} Details
                    </p>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="space-y-4">
                        {analysisData.map((item, index) => (
                            <div 
                                className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0" 
                                key={`${item.name}-${index}`}
                            >
                                <span className="text-sm font-normal text-gray-500 uppercase tracking-wide">
                                    {item.name}
                                </span>
                                <span className="text-base font-medium text-gray-800">
                                    {item.value}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Carbon Impact Callout */}
                    {entry.carbonFootprint && (
                        <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl">
                            <div className="flex items-center">
                                <div className="text-red-500 text-2xl mr-3">🌍</div>
                                <div>
                                    <h3 className="text-sm font-medium text-red-700">Carbon Impact</h3>
                                    <p className="text-xl font-semibold text-red-600">{entry.carbonFootprint} kg CO₂</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default EntryPage;