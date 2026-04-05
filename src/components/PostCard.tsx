import type { Post } from "@/types/post"

type Props = {
  post: Post
}

export default function PostCard({ post }: Props) {
  const renderTags = () => {
    if (post.review_target === "anime") {
      return (
        <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded mr-2">
          アニメ
        </span>
      )
    }
    if (post.review_target === "manga") {
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
    <div className="bg-white p-4 rounded-lg border border-gray-300 mb-4 shadow-sm">
      {/* タグ */}
      <div>{renderTags()}</div>

      {/* 画像 */}
      {post.image_url && (
        <img
          src={post.image_url}
          alt={post.title}
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
    </div>
  )
}