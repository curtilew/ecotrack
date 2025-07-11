import CreateLog from "@/components/CreateLog"
import EntryCard from "@/components/EntryCard"
import EntryOptions from "@/components/EntryOptions"
// import { analyze } from "@/utils/ai"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import Link from "next/link"


const getLogs = async () => {
    const user = await getUserByClerkID()
    const logs = await prisma.transportationActivityLog.findMany({
        where: {
            userId: user.id,
        },
        orderBy: {
            createdAt: 'desc',
        },
    })

    

    return logs
}

const ActivityLogPage = async () => {
    const logs = await getLogs()

    return (
        <div className="p-10 bg-zinc-400/10 h-full">
            <h2 className="text-3xl mb-8">Log New Activity</h2>
        <div className="gap-4">
        <CreateLog />
        <EntryOptions />
        {logs.map((log) => (
            <Link href={`/activitylog/${log.id}`} key={log.id}>
                <EntryCard key={log.id} log={log} />
            </Link>
            
    ))}
        </div>
        </div>
    )
    }

export default ActivityLogPage