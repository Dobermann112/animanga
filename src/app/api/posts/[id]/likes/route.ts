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

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: Number(session.user.id),
          postId,
        },
      },
    })

    if (existingLike) {
      return NextResponse.json(
        { error: "Already liked" },
        { status: 409 }
      )
    }

    const like = await prisma.like.create({
      data: {
        userId: Number(session.user.id),
        postId,
      },
    })

    return NextResponse.json({ like }, { status: 201 })
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

    const existingLike = await prisma.like.findUnique({
      where: {
        userId_postId: {
          userId: Number(session.user.id),
          postId,
        },
      },
    })

    if (!existingLike) {
      return NextResponse.json(
        { error: "Like not found" },
        { status: 404 }
      )
    }

    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: Number(session.user.id),
          postId,
        },
      },
    })

    return NextResponse.json({ id: existingLike.id }, { status: 200 })
  } catch (error) {
    console.error("Error", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}