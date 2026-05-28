import { PrismaClient } from "@prisma/client"
import { notFound } from "next/navigation"
import Header from "@/components/Header"
import DeletePostButton from "./DeletePostButton"
import Link from "next/link"
import Image from "next/image"

const prisma = new PrismaClient()

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params

  const post = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
  })

  if (!post) {
    notFound()
  }

  const renderTags = () => {
    if (post.reviewTarget === "ANIME") {
      return (
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
          アニメ
        </span>
      )
    }
    if (post.reviewTarget === "MANGA") {
      return (
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
          漫画
        </span>
      )
    }
    return (
      <>
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
          漫画
        </span>
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded">
          アニメ
        </span>
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto px-4">

        <Header />

        <article className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
          {/* タグ */}
          <div>{renderTags()}</div>

          {/* 画像 */}
          {post.imageUrl && (
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={800}
              height={400}
              className="w-full h-48 object-cover rounded mt-3"
            />
          )}

          {/* タイトル */}
          <p className="font-bold text-lg mt-3 text-gray-800">
            {post.title}
          </p>

          {/* 星評価 */}
          <p className="text-orange-500 mt-1">
            {"★".repeat(post.rating)}
          </p>

          {/* コメント */}
          <p className="mt-2 text-gray-600">
            {post.comment}
          </p>

          <hr className="my-4 border-gray-200" />

          {/* 詳細レビュー */}
          <div>
            <p className="font-bold text-gray-800 mb-2">
              詳細レビュー
            </p>
            <p className="text-gray-600 leading-relaxed">
              {post.review || "レビューはありません。"}
            </p>
          </div>

          {/* 投稿日 */}
          <p className="text-sm text-gray-400 mt-4">
            投稿日: {post.createdAt.toLocaleDateString("ja-JP")}
          </p>

          <div className="flex justify-between mt-4">
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 mt-1 py-1 rounded transition"
            >
              編集する
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        </article>
      </div>
    </div>
  )
}