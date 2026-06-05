import type { PostWithLikeCount } from "@/types/post"
import ReviewTargetTag from "./ReviewTargetTag"
import Image from "next/image"

type Props = {
  post: PostWithLikeCount
}

export default function PostCard({ post }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4 shadow-sm">
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

      <p className="mt-2 text-sm text-gray-500">
        ❤️ {post._count.likes}
      </p>
    </div>
  )
}