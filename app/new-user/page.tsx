import { prisma } from "@/utils/db"
import { auth } from "@clerk/nextjs"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

const createNewUser = async () => {
    const user = await currentUser()
    const match = await prisma.user.findUnique({
        where: {
            clerkId: user.id as string,
        },
    })

    if (!match) {
        console.log(user?.emailAddresses)
        await prisma.user.create({
            data: {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
            }
        })
        console.log("user created")
    } else {
        console.log("existing user found")
    }
    
    // Always redirect to journal after checking/creating user
    redirect('/journal')
}

const NewUser = async () => {
    await createNewUser()
    return <div>...loading</div>
}

export default NewUser;
