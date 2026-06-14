import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"

import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"

export default async function MyPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const userId = Number(session.user.id)

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    redirect("/login")
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">マイページ</h1>

      <div className="mt-6 rounded-lg border p-4">
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </main>
  )
}