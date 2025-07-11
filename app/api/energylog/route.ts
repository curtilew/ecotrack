import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

// @ts-expect-error Database returns null but component expects undefined
const createLocalDate = (dateString) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day); // month is 0-indexed
};

export const POST = async (request: Request) => {
    const user = await getUserByClerkID();
    const requestBody = await request.json();
    const wrappedData = requestBody.entryData;
    
    const { note, energyType, date, usage, unit, carbonFootprint } = wrappedData;

    const log = await prisma.energyActivityLog.create({
        data: {
            userId: user.id,
            note: note || null,
            energyType: energyType || null,
            date: date ? createLocalDate(date) : new Date(),
            usage: usage ? parseFloat(usage) : null,
            unit: unit || null,
            carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        },
    });

    revalidatePath('/activitylog');
    return NextResponse.json({ data: log });
}

// export const POST = async (request: Request) => {
//     const user = await getUserByClerkID();
//     const requestBody = await request.json();
    
//     // Debug: Log the exact structure of what we receive
//     console.log('=== DEBUG: REQUEST BODY ===');
//     console.log(JSON.stringify(requestBody, null, 2));
//     console.log('=== END DEBUG ===');
    
//     // Try different ways to extract the data
//     let extractedData;
    
//     // Method 1: Direct destructuring (if data is at root level)
//     const directData = requestBody;
//     console.log('Direct data:', directData);
    
//     // Method 2: Check if it's wrapped in entryData
//     const wrappedData = requestBody.entryData;
//     console.log('Wrapped data:', wrappedData);
    
//     // Use whichever one has the actual data
//     extractedData = wrappedData;
    
//     const { note, energyType, date, usage, unit, carbonFootprint } = extractedData;
    
//     console.log('Extracted fields:', {
//         note,
//         energyType, 
//         date,
//         usage,
//         unit,
//         carbonFootprint
//     });

//     const log = await prisma.energyActivityLog.create({
//         data: {
//             userId: user.id,
//             note: note || null,
//             energyType: energyType || null,
//             date: date ? new Date(date) : new Date(),
//             usage: usage ? parseFloat(usage) : null,
//             unit: unit || null,
//             carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
//         },
//     });

//     console.log('Created log in DB:', log);

//     revalidatePath('/activitylog');
//     return NextResponse.json({ data: log });
// }