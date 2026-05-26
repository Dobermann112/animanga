import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

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

    const body = await request.json()

    const { title, imageUrl, comment, review, rating, reviewTarget } = body

    // バリデーション
    if (!title || !comment || !reviewTarget) {
      return NextResponse.json(
        { error: "title, comment, reviewTarget are required" },
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
        comment,
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

    await prisma.post.delete({
      where: { id: postId }
    })

    return NextResponse.json({ id }, { status: 200 })

  } catch (error) {
    console.log("ERROR", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}