import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, { params }) => {
    const { energyType, usage, unit, date, note } = await request.json();

    const user = await getUserByClerkID();
    const { id } = params;

    const updatedLog = await prisma.energyActivityLog.update({
        where: {
            userId_id: {
                userId: user.id,
                id: id,
            },
        },
        data: {
            energyType,
            usage,
            unit,
            date,
            note,
        }
    });

    return NextResponse.json({ data: updatedLog });
}