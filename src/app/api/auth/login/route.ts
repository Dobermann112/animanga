import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: "email, password are required" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
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