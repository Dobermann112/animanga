import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcrypt"

const createUsername = (name: string) => {
  const baseUsername = name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")

  if (baseUsername) {
    return `${baseUsername}-${Date.now()}`
  }

  return `user-${Date.now()}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "name, email, password are required" },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "password must be at least 8 characters" },
        { status: 400 }
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "This email has been taken already" },
        { status: 400 }
      )
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    const username = createUsername(name)

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
      },
    })

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("ERROR", error)

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}