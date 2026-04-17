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

    const documents = await prisma.document.findMany({
      where: {
        ...(projectId ? { projectId } : {})
      },
      include: {
        project: { select: { title: true } },
        uploadedBy: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("[DOCUMENTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

// POST endpoint for uploading could go here.
// In a real application, we would use a service like AWS S3 or Vercel Blob,
// store the file there, and write the URL to the Prisma DB.
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { title, projectId, fileType, fileUrl } = json

    if (!title || !projectId || !fileUrl) {
      return new NextResponse("Missing required fields", { status: 400 })
    }

    const document = await prisma.document.create({
      data: {
        title,
        fileUrl,
        fileType: fileType || "document",
        projectId,
        uploadedById: session.user.id
      }
    })

    return NextResponse.json(document)
  } catch (error) {
    console.error("[DOCUMENTS_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
