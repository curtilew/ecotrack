import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import ActivityLogClient from "./ActivityLogClient"


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

const ActivityLogPage = async () => {
    const logs = await getLogs()

    return <ActivityLogClient logs={logs} />
}

export default ActivityLogPage











// import CreateTransLog from "@/components/CreateTransLog"
// import EntryCard from "@/components/EntryCard"
// import EntryOptions from "@/components/EntryOptions"
// // import { analyze } from "@/utils/ai"
// import { getUserByClerkID } from "@/utils/auth"
// import { prisma } from "@/utils/db"
// import Link from "next/link"


// const getLogs = async () => {
//     const user = await getUserByClerkID()
//     const logs = await prisma.transportationActivityLog.findMany({
//         where: {
//             userId: user.id,
//         },
//         orderBy: {
//             createdAt: 'asc',
//         },
//     })

    

//     return logs
// }

// const ActivityLogPage = async () => {
//     const logs = await getLogs()

//     return (
//         <div className="p-10 bg-zinc-400/10 h-full">
//             <h2 className="text-3xl mb-8">Log New Activity</h2>
//         <div className="gap-4">
//         <CreateTransLog />
//         <EntryOptions />
//         {logs.map((log) => (
//             <Link href={`/activitylog/${log.id}`} key={log.id}>
//                 <EntryCard key={log.id} log={log} />
//             </Link>
            
//     ))}
//         </div>
//         </div>
//     )
//     }

// export default ActivityLogPage