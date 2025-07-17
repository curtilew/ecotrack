// import { analyze } from "@/utils/ai"
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

    const { note, activityType, date, distance, carbonFootprint } = wrappedData;

    const log = await prisma.transportationActivityLog.create({
        data: {
            userId: user.id,
            note: note || null, //Need to include fallbacks for each data point. will not record to db if fallback not included
            activityType: activityType || null,
            date: date ? createLocalDate(date) : new Date(),
            distance: distance ? parseFloat(distance) : null,
            carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        },
    });

    revalidatePath('/activitylog');
    return NextResponse.json({ data: log });
}