import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


export const POST = async (request: Request) => {
    const user = await getUserByClerkID();
    const requestBody = await request.json();
    const wrappedData = requestBody.entryData;

    const { note, category, date, itemName, price, quantity, isSecondHand, carbonFootprint } = wrappedData;

    const log = await prisma.shoppingActivityLog.create({
        data: {
            userId: user.id,
            note: note || null,
            category: category || null,
            date: date ? new Date(date) : new Date(),
            itemName: itemName || null,
            price: price ? parseFloat(price) : null,
            quantity: quantity ? parseInt(quantity) : null,
            isSecondHand: isSecondHand ?? false,
            carbonFootprint: carbonFootprint ? parseFloat(carbonFootprint) : 0,
        },
    });

    revalidatePath('/activitylog');
    return NextResponse.json({ data: log });
}