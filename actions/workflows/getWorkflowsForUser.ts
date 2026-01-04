"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getWorkflowsForUser() {
    const { userId } = auth();
    if (!userId) {
        throw new Error("Unauthorized");
    }

    // Fetch workflows from the database
    return prisma.workflow.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}