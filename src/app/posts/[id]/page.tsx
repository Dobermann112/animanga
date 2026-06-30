import { getServerSession } from "next-auth"
import { authOptions } from "@/auth"
import { prisma } from "@/lib/prisma"
import { postCardInclude, postUserSelect } from "@/lib/postQuery"
import { notFound } from "next/navigation"
import ReviewTargetTag from "@/components/ReviewTargetTag"
import DeletePostButton from "./DeletePostButton"
import Link from "next/link"
import UserLink from "@/components/UserLink"
import Image from "next/image"
import NewPostButton from "@/components/NewPostButton"
import LikeButton from "@/components/LikeButton"
import BookmarkButton from "@/components/BookmarkButton"
import CommentForm from "@/components/CommentForm"
import CommentList from "@/components/CommentList"

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function PostDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  const { id } = await params

  const postId = Number(id)

  if (Number.isNaN(postId)) {
    notFound()
  }

  const userId = session?.user?.id ? Number(session.user.id) : -1

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      ...postCardInclude(userId),
      comments: {
        include: {
          user: {
            select: postUserSelect,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!post) {
    notFound()
  }

  const isOwner = session?.user?.id && post.userId === Number(session.user.id)

  const isLiked = post.likes.length > 0
  const isBookmarked = post.bookmarks.length > 0

  return (
    <>
      <article className="bg-white p-4 rounded-lg border border-gray-300 shadow-sm">
        {/* タグ */}
        <div><ReviewTargetTag reviewTarget={post.reviewTarget} /></div>

        {/* 投稿者 */}
        <UserLink
          username={post.user.username}
          name={post.user.name}
          className="mt-2"
        />

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

        <div className="flex items-center gap-4">
          <LikeButton postId={post.id} initialLiked={isLiked} initialLikeCount={post._count.likes} />
          <BookmarkButton postId={post.id} initialBookmarked={isBookmarked} initialBookmarkCount={post._count.bookmarks} />
        </div>

        {/* 作品概要 */}
        <p className="mt-2 text-gray-600">
          {post.description}
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

        { isOwner && (
          <div className="flex justify-between mt-4">
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-block bg-green-600 hover:bg-green-700 text-white px-4 mt-1 py-1 rounded transition"
            >
              編集する
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        )}
      </article>

      <section className="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-xl font-bold text-gray-900">
            コメント
          </h2>

          {session?.user ? (
            <CommentForm postId={post.id} />
          ) : (
            <p className="mt-4 text-sm text-gray-500">
              コメントするにはログインが必要です。
            </p>
          )}

          <CommentList
            comments={post.comments}
            postId={post.id}
            currentUserId={session?.user?.id ? Number(session.user.id) : null}
          />
        </section>

      <NewPostButton isLoggedIn={!!session?.user} />
    </>
  )
}
