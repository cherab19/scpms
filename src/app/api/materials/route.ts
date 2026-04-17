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

    const materials = await prisma.material.findMany({
      where: {
        ...(projectId ? { projectId } : {})
      },
      include: {
        project: { select: { title: true } },
        supplier: { select: { name: true } },
        usages: { select: { quantity: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate remaining quantity
    const enriched = materials.map(m => {
      const used = m.usages.reduce((sum, usage) => sum + usage.quantity, 0)
      return {
        ...m,
        usedQuantity: used,
        remainingQuantity: m.quantity - used
      }
    })

    return NextResponse.json(enriched)
  } catch (error) {
    console.error("[MATERIALS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
