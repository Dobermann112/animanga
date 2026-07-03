import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export async function POST(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const followerId = Number(session.user.id)

    const targetUser = await prisma.user.findUnique({ where: { username } })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (followerId === targetUser.id) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId: targetUser.id },
      },
    })

    if (existing) {
      return NextResponse.json({ error: "Already following" }, { status: 409 })
    }

    const follow = await prisma.follow.create({
      data: { followerId, followingId: targetUser.id },
    })

    return NextResponse.json({ follow }, { status: 201 })
  } catch (error) {
    console.error("Error", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
    const { username } = await params
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const followerId = Number(session.user.id)

    const targetUser = await prisma.user.findUnique({ where: { username } })

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: { followerId, followingId: targetUser.id },
      },
    })

    if (!existing) {
      return NextResponse.json({ error: "Not following" }, { status: 404 })
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: { followerId, followingId: targetUser.id },
      },
    })

    return NextResponse.json({ id: existing.id }, { status: 200 })
  } catch (error) {
    console.error("Error", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
