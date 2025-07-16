import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

// @ts-expect-error dynamic log type lookup
export const PATCH = async (request: Request, { params }) => {
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
            // @ts-expect-error error may not have a message property
            { error: 'Failed to update food log', details: error.message },
            { status: 500 }
        );
    }
}

// @ts-expect-error Database returns null but component expects undefined
export const DELETE = async (request: Request, { params }) => {
    try {
        const user = await getUserByClerkID();
        const { id } = params;
        
        console.log('Deleting food log:', id);
        
        const existingLog = await prisma.foodActivityLog.findUnique({
            where: {
                userId_id: {
                    userId: user.id,
                    id: id,
                },
            },
        });
        
        if (!existingLog) {
            return NextResponse.json(
                { error: 'Log not found or unauthorized' },
                { status: 404 }
            );
        }
        
        const deletedLog = await prisma.foodActivityLog.delete({
            where: {
                userId_id: {
                    userId: user.id,
                    id: id,
                },
            },
        });
        
        revalidatePath('/activitylog');
        return NextResponse.json({ 
            data: deletedLog,
            message: 'Food log deleted successfully' 
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete food log' },
            { status: 500 }
        );
    }
}
