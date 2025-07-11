// import EntryCard from "@/app/components/EntryCard"
// import EntryOptions from "@/app/components/EntryOptions"
// import { analyze } from "@/utils/ai"
// import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import Link from "next/link"


// const getLogs = async () => {
//     const user = await getUserByClerkID()
//     const logs = await prisma.transportationactivitylog.findMany({
//         where: {
//             userId: user.id,
//         },
//         orderBy: {
//             createdAt: 'desc',
//         },
//     })

    

//     return logs
// }

const ActivityPage = async () => {
    // const logs = await getLogs()
    
    return (
        <div className="p-10 bg-zinc-400/10 h-full">
            <h2 className="text-3xl mb-8">Home</h2>
        {/* <div className="grid grid-cols-3 gap-4">
        <EntryOptions />
        {logs.map((log) => (
            <Link href={`/dashboard_home/${log.id}`} key={log.id}>
                <EntryCard key={log.id} entry={log} />
            </Link>
            
    ))}
        </div> */}
        </div>
    )
    }

export default ActivityPage