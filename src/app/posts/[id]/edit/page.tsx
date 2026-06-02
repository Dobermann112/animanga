import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import EditPostForm from "./EditPostForm"

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
    <>
      <EditPostForm post={post} />
    </>
  )
}