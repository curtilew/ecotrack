import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { revalidatePath } from "next/cache"
import { NextResponse } from "next/server"


// @ts-expect-error dynamic log type lookup
export const PATCH = async (request: Request, { params }) => {
    try {
        // Get the request body
        const body = await request.json();
        console.log('Received PATCH request body:', body);

        // Extract data - handle both wrapped and direct formats
        let energyType, usage, unit, date, note;
        
        if (body.logData) {
            // If data is wrapped in logData (from your updateEntryByType function)
            ({ energyType, usage, unit, date, note } = body.logData);
        } else {
            // If data is sent directly (from your updateEntry function)
            ({ energyType, usage, unit, date, note } = body);
        }

        console.log('Extracted fields:', { energyType, usage, unit, date, note });

        const user = await getUserByClerkID();
        const { id } = params; // Remove await - params is not a Promise

        console.log('Updating energy log with ID:', id, 'for user:', user.id);

        const updatedLog = await prisma.energyActivityLog.update({
            where: {
                userId_id: {
                    userId: user.id,
                    id: id,
                },
            },
            data: {
                energyType,
                usage: usage ? parseFloat(usage) : null, // Convert string to number
                unit,
                date: date ? new Date(date) : null, // Convert string to Date
                note,
            }
        });

        console.log('Successfully updated energy log:', updatedLog);
        return NextResponse.json({ data: updatedLog });

    } catch (error) {
        console.error('Error updating energy log:', error);
        return NextResponse.json(
            // @ts-expect-error error may not have a message property
            { error: 'Failed to update energy log', details: error.message },
            { status: 500 }
        );
    }
}

// @ts-expect-error Database returns null but component expects undefined
export const DELETE = async (request: Request, { params }) => {
    try {
        const user = await getUserByClerkID();
        const { id } = params;
        
        console.log('Deleting energy log:', id);
        
        const existingLog = await prisma.energyActivityLog.findUnique({
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
        
        const deletedLog = await prisma.energyActivityLog.delete({
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
            message: 'Energy log deleted successfully' 
        });
        
    } catch (error) {
        console.error('Delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete energy log' },
            { status: 500 }
        );
    }
}
