// import { analyze } from "@/utils/ai"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


// export const POST = async () => {
//     const user = await getUserByClerkID()
//     const log = await prisma.transportationActivityLog.create({
//         data: {
//             userId: user.id,
//             note: 'Enter any notes here', // Placeholder for note, you can modify this as needed
//             activityType: 'transportation', // Example activity type, adjust as necessary
//             date: new Date(), // Current date, you can modify this as needed
//             distance: 0, // Placeholder for distance, adjust as necessary
//             carbonFootprint: 0, // Placeholder for carbon footprint, adjust as necessary
//         },
//     })

//     // const analysis = await analyze(log.note)
//     // await prisma.analysis.create({
//     //     data: {
//     //         logId: log.id,
//     //         ...analysis, //all schema and ai schema match
//     //     },
//     // })

//     revalidatePath('/activitylog')
    
//     return NextResponse.json({ data: log })
// }


export const POST = async (request: Request) => {
    const user = await getUserByClerkID();
    const requestBody = await request.json();
    const wrappedData = requestBody.entryData;

    const { note, activityType, date, distance, carbonFootprint } = wrappedData;

    const log = await prisma.transportationActivityLog.create({
        data: {
            userId: user.id,
            note: note || null, //Need to include fallbacks for each data point. will not record to db if fallback not included
            activityType: activityType || null,
            date: date ? new Date(date) : new Date(),
            distance: distance ? parseFloat(distance) : null,
            carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        },
    });

    revalidatePath('/activitylog');
    return NextResponse.json({ data: log });
}