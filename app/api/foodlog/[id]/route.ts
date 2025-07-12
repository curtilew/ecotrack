import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const body = await request.json();
        console.log('Food PATCH - Received body:', body);
        
        // Extract the specific fields for food
        const { foodType, quantity, unit, mealType, date, note } = body.logData;
        
        const user = await getUserByClerkID();
        const { id } = params;
        
        console.log('Updating food log ID:', id);

        const updatedLog = await prisma.foodActivityLog.update({
            where: {
                userId_id: {
                    userId: user.id,
                    id: id,
                },
            },
            data: {
                foodType,
                quantity: quantity ? parseFloat(quantity) : null,
                unit,
                mealType,
                date: date ? new Date(date) : null,
                note,
            }
        });

        console.log('Food log updated successfully:', updatedLog);
        return NextResponse.json({ data: updatedLog });
        
    } catch (error) {
        console.error('Error updating food log:', error);
        return NextResponse.json(
            { error: 'Failed to update food log', details: error.message },
            { status: 500 }
        );
    }
}