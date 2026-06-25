import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, bio } = body

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "name is required" },
        { status: 400 }
      )
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: "name must be 50 characters or less" },
        { status: 400 }
      )
    }

    if (bio && typeof bio !== "string") {
      return NextResponse.json(
        { error: "bio must be a string" },
        { status: 400 }
      )
    }

    if (bio && bio.length > 300) {
      return NextResponse.json(
        { error: "bio must be 300 characters or less" },
        { status: 400 }
      )
    }

    const userId = Number(session.user.id)

    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        bio: bio || null,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          bio: user.bio,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("ERROR", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}