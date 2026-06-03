import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import EditPostForm from "./EditPostForm"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect("/login")
  }

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!post) {
    notFound()
  }

  if (post.userId !== Number(session.user.id)) {
    redirect("/")
  }

  return (
    <>
      <EditPostForm post={post} />
    </>
  )
}