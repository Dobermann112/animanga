import type { PostWithCounts } from "@/types/post"
import ReviewTargetTag from "./ReviewTargetTag"
import Image from "next/image"
import LikeButton from "./LikeButton"
import Link from "next/link"
import BookmarkButton from "./BookmarkButton"

type Props = {
  post: PostWithCounts
}

export default function PostCard({ post }: Props) {
  const isLiked = post.likes.length > 0
  const isBookmarked = post.bookmarks.length > 0

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4 shadow-sm">
      <Link href={`/posts/${post.id}`} className="block">
        {/* タグ */}
        <div><ReviewTargetTag reviewTarget={post.reviewTarget} /></div>

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
      </Link>

      <div className="flex items-center gap-4">
        <LikeButton postId={post.id} initialLiked={isLiked} initialLikeCount={post._count.likes} />
        <BookmarkButton postId={post.id} initialBookmarked={isBookmarked} initialBookmarkCount={post._count.bookmarks} />

        <span className="text-sm text-gray-500">
          コメント {post._count.comments}
        </span>
      </div>
    </div>
  )
}