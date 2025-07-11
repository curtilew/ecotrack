import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"
// @ts-expect-error Database returns null but component expects undefined
export const PATCH = async (request: Request, { params }) => {
    const { category, itemName, price, quantity, isSecondHand, date, note } = await request.json();

    const user = await getUserByClerkID();
    const { id } = params;

    const updatedLog = await prisma.shoppingActivityLog.update({
        where: {
            userId_id: {
                userId: user.id,
                id: id,
            },
        },
        data: {
            category,
            itemName,
            price,
            quantity,
            isSecondHand,
            date,
            note,
        }
    });

    return NextResponse.json({ data: updatedLog });
}