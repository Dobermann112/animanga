import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import EditPostForm from "./EditPostForm"

const prisma = new PrismaClient()

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EditPage({ params }: Props) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id)
    }
  })

  if (!post) {
    notFound()
  }

  return (
    <div>
      <EditPostForm post={post} />
    </div>
  )
}