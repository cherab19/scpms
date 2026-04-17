import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const status = searchParams.get("status")

    // Admin can see all projects, others see projects they are members of or manage
    // For simplicity of this MVP, let's just return all projects the user is related to
    const projects = await prisma.project.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        OR: [
          { managerId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      },
      include: {
        manager: {
          select: { name: true, email: true }
        },
        _count: {
          select: { tasks: true, members: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("[PROJECTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Only Admin or Project Manager should create projects ideally, but keeping it open for MVP
    const json = await req.json()
    const { title, description, startDate, endDate } = json

    if (!title) {
      return new NextResponse("Title is required", { status: 400 })
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        managerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: "PROJECT_MANAGER"
          }
        }
      }
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
