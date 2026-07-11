import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 401 }
      )
    }

    if (existingPost.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    const body = await request.json()

    const { title, imageUrl, imageSource, description, review, rating, reviewTarget } = body

    // バリデーション
    if (!title || !description || !reviewTarget) {
      return NextResponse.json(
        { error: "title, description, reviewTarget are required" },
        { status: 400 }
      )
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "rating must be between 1 and 5" },
        { status: 400 }
      )
    }

    // DB更新
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        title,
        imageUrl,
        imageSource,
        description,
        review,
        rating,
        reviewTarget,
      },
    })

    // 成功レスポンス
    return NextResponse.json({ post }, { status: 200 })

  } catch (error) {
    console.error("ERROR", error)

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

    const existingPost = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      )
    }

    if (existingPost.userId !== Number(session.user.id)) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      )
    }

    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({ id }, { status: 200 })

  } catch (error) {
    console.error("ERROR", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}