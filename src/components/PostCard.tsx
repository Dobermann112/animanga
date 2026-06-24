import type { PostWithCounts } from "@/types/post"
import ReviewTargetTag from "./ReviewTargetTag"
import Image from "next/image"
import LikeButton from "./LikeButton"
import Link from "next/link"
import BookmarkButton from "./BookmarkButton"
import { MessageCircle } from "lucide-react"
import { User } from "lucide-react"

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

        {/* 作品概要 */}
        <p className="mt-2 text-gray-600">
          {post.description}
        </p>
      </Link>

      <div className="mt-3 flex items-center gap-3">
        <LikeButton postId={post.id} initialLiked={isLiked} initialLikeCount={post._count.likes} />
        <BookmarkButton postId={post.id} initialBookmarked={isBookmarked} initialBookmarkCount={post._count.bookmarks} />

        <span className="inline-flex items-center gap-1 text-sm text-gray-600">
          <MessageCircle size={18} />
          <span className="leading-none">{post._count.comments}</span>
        </span>
        
        {post.user.username && (
          <Link
            href={`/users/${post.user.username}`}
            className="ml-auto inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
          >
            <User size={12} />
            {post.user.name}
          </Link>
        )}
      </div>
    </div>
  )
}