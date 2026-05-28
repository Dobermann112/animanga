import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
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
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto px-4">

        <Header />

        <EditPostForm post={post} />
      </div>
    </div>
  )
}