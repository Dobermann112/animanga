import { PrismaClient } from "@prisma/client"
import { NextResponse } from "next/server"

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("BODY:", body)

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

    // DB保存
    const post = await prisma.post.create({
      data: {
        title,
        imageUrl,
        comment,
        review,
        rating,
        reviewTarget,
        userId: 1, // MVPのため固定
      },
    })

    // 成功レスポンス
    return NextResponse.json({ post }, { status: 201 })

  } catch (error) {
    console.error("ERROR", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}