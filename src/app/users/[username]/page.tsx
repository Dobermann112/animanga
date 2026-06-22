import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

type Props = {
  params: Promise<{
    username: string
  }>
}

export default async function UserDetailPage({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    notFound()
  }

  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  )
}