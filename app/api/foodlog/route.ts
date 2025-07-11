import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

const createLocalDate = (dateString) => {
    if (!dateString) return new Date();
    const [year, month, day] = dateString.split('-');
    return new Date(year, month - 1, day); // month is 0-indexed
};


export const POST = async (request: Request) => {
    const user = await getUserByClerkID();
    const requestBody = await request.json();
    const wrappedData = requestBody.entryData;

    const { note, foodType, date, quantity, unit, mealType, carbonFootprint } = wrappedData;

    const log = await prisma.foodActivityLog.create({
        data: {
            userId: user.id,
            note: note || null,
            foodType: foodType || null,
            date: date ? createLocalDate(date) : new Date(),
            quantity: quantity ? parseFloat(quantity) : null,
            unit: unit || null,
            mealType: mealType || null,
            carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        },
    });

    revalidatePath('/activitylog');
    return NextResponse.json({ data: log });
}