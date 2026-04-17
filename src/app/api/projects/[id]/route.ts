import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const project = await prisma.project.findUnique({
      where: {
        id: params.id,
      },
      include: {
        manager: {
          select: { name: true, email: true }
        },
        members: {
          include: {
            user: {
              select: { name: true, email: true, image: true }
            }
          }
        },
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        materials: {
          take: 5
        }
      }
    })

    if (!project) {
      return new NextResponse("Project not found", { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error("[PROJECT_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
