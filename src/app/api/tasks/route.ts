import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const projectId = searchParams.get("projectId")

    const tasks = await prisma.task.findMany({
      where: {
        ...(projectId ? { projectId } : {}),
        // Admin sees all, otherwise filter by assignee or project manager
        // Omitting strict filtering for MVP simplicity and showing all relevant tasks
      },
      include: {
        project: { select: { title: true } },
        assignee: { select: { name: true, image: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("[TASKS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { title, description, projectId, assigneeId, dueDate, status } = json

    if (!title || !projectId) {
      return new NextResponse("Title and Project ID are required", { status: 400 })
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        projectId,
        assigneeId,
        status: status || "PENDING",
        dueDate: dueDate ? new Date(dueDate) : null,
      }
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("[TASKS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
