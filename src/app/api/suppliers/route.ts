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

    const suppliers = await prisma.supplier.findMany({
      include: {
        _count: {
          select: { materials: true }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(suppliers)
  } catch (error) {
    console.error("[SUPPLIERS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
