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

    const budgets = await prisma.budget.findMany({
      where: {
        ...(projectId ? { projectId } : {})
      },
      include: {
        project: { select: { title: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(budgets)
  } catch (error) {
    console.error("[BUDGETS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
