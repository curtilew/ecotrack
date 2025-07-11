
import Editor from "@/components/Editor";
import { getUserByClerkID } from "@/utils/auth";
import { prisma } from "@/utils/db";

const getLog = async (id) => {
    const user = await getUserByClerkID()
    const log = await prisma.transportationActivityLog.findUnique({
        where: {
            userId_id: { //userId_id created to be a unique key (see prisma schema)
                userId: user.id,
                id,
            },
        },
    })

    return log
}

const LogPage = async ({ params }) => {
 
    const { id } = await params;

    const log = await getLog(id)
    const analysisData = [
        {name: 'Subject', value: ''},
        {name: 'Subject', value: ''},
        {name: 'Mood', value: ''},
        {name: 'Negative', value: false},
    ]
    return <div className="h-full w-full grid grid-cols-3">
        <div className="col-span-2">
            <Editor log={log} />
        </div>
        <div className="border-l border-black/10">
            <div className="bg-blue-300 px-6 py-10">
                <h2 className="text-2xl">Analysis</h2>
            </div>
                <div>
                    <ul>
                        {analysisData.map(item => [
                            <li className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10" key={item.name}>
                                <span className="text-lg font-semibold">{item.name}</span>
                                <span>{item.value}</span>
                            </li>
                        ])}
                    </ul>
                </div>
        </div>
    </div>
}

export default LogPage