"use server";

import { prisma } from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflows";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function CreateWorkflow(form: createWorkflowSchemaType) {
    // need Zod validation here again because
    // a server action is a HTTP endpoint exposed to the internet
    // and we cannot fully trust the client
    // even though we already validated on the client side
    const { success, data } = createWorkflowSchema.safeParse(form);
    if (!success) {
        throw new Error("Invalid form data");
    }

    const { userId } = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    const result = await prisma.workflow.create({
        data: {
            userId,
            status: WorkflowStatus.DRAFT,
            definition: "TODO",
            ...data,
        },
    });
    if (!result) {
        throw new Error("Failed to create workflow");
    }
    return result.id;
}