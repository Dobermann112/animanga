import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try{
    const { id } = await params
    const postId = Number(id)

    if (Number.isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post Id" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: postId }
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: Number(session.user.id),
          postId,
        },
      },
    })

    if (existingBookmark) {
      return NextResponse.json(
        { error: "Already bookmarked" },
        { status: 409 }
      )
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId: Number(session.user.id),
        postId,
      },
    })

    return NextResponse.json({ bookmark }, { status: 201 })
  } catch (error) {
    console.error("Error", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const postId = Number(id)

    if (Number.isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid post Id" },
        { status: 400 }
      )
    }

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: Number(session.user.id),
          postId,
        },
      },
    })

    if (!existingBookmark) {
      return NextResponse.json(
        { error: "Bookmark not found" },
        { status: 404 }
      )
    }

    await prisma.bookmark.delete({
      where: {
        userId_postId: {
          userId: Number(session.user.id),
          postId,
        },
      },
    })

    return NextResponse.json({ id: existingBookmark.id }, { status: 200 })
  } catch (error) {
    console.error("Error", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}