import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"

// @ts-expect-error Database returns null but component expects undefined
export const PATCH = async (request: Request, { params }) => {
    try {
        const body = await request.json();
        console.log('Shopping PATCH - Received body:', body);
        
        // Extract the specific fields for shopping
        const { category, itemName, price, quantity, isSecondHand, date, note } = body.logData;
        
        const user = await getUserByClerkID();
        const { id } = params;
        
        console.log('Updating shopping log ID:', id);

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
                price: price ? parseFloat(price) : null,
                quantity: quantity ? parseInt(quantity) : null,
                isSecondHand: Boolean(isSecondHand),
                date: date ? new Date(date) : null,
                note,
            }
        });

        console.log('Shopping log updated successfully:', updatedLog);
        return NextResponse.json({ data: updatedLog });
        
    } catch (error) {
        console.error('Error updating shopping log:', error);
        return NextResponse.json(
            // @ts-expect-error error may not have a message property
            { error: 'Failed to update shopping log', details: error.message },
            { status: 500 }
        );
    }
}

// @ts-expect-error Database returns null but component expects undefined
export const DELETE = async (request: Request, { params }) => {
    try {
        const user = await getUserByClerkID();
        const { id } = params;
        
        console.log('Deleting shopping log:', id);
        
        const existingLog = await prisma.shoppingActivityLog.findUnique({
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
        
        const deletedLog = await prisma.shoppingActivityLog.delete({
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
            message: 'Shopping log deleted successfully' 
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete shopping log' },
            { status: 500 }
        );
    }
}