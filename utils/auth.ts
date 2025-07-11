import { auth } from "@clerk/nextjs/server"
import { prisma } from "./db"


export const getUserByClerkID = async () => {
    const {userId} = await auth()

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            // @ts-expect-error Database returns null but component expects undefined
            clerkId: userId,
        },
    })

    return user
}