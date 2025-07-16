import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


export const PATCH = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const body = await request.json();
        console.log('Transportation PATCH - Received body:', body);
        
        // Extract the specific fields for transportation
        const { activityType, distance, date, note } = body.logData;
        
        const user = await getUserByClerkID();
        const { id } = params; // Remove await
        
        console.log('Updating transportation log ID:', id);

        const updatedLog = await prisma.transportationActivityLog.update({
            where: {
                userId_id: {
                    userId: user.id,
                    id: id,
                },
            },
            data: {
                activityType,
                distance: distance ? parseFloat(distance) : null,
                date: date ? new Date(date) : null,
                note,
            }
        });

        console.log('Transportation log updated successfully:', updatedLog);
        return NextResponse.json({ data: updatedLog });
        
    } catch (error) {
        console.error('Error updating transportation log:', error);
        return NextResponse.json(
            // @ts-expect-error error may not have a message property
            { error: 'Failed to update transportation log', details: error.message },
            { status: 500 }
        );
    }
}

export const DELETE = async (request: Request, { params }: { params: { id: string } }) => {
    try {
        const user = await getUserByClerkID();
        const { id } = params;
        
        console.log('Deleting transportation log:', id);
        
        // First check if the log belongs to the user
        const existingLog = await prisma.transportationActivityLog.findUnique({
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
        
        // Delete the log
        const deletedLog = await prisma.transportationActivityLog.delete({
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
            message: 'Transportation log deleted successfully' 
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete transportation log' },
            { status: 500 }
        );
    }
}
