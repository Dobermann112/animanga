import Link from "next/link"
import PostCard from "@/components/PostCard"
import type { Post } from "@/types/post"

export default async function Home() {
  const res = await fetch("http://localhost:3000/api/posts", {
    cache: "no-store", // 毎回最新データ取得（重要）
  })

  if (!res.ok) {
    throw new Error("投稿の取得に失敗しました")
  }

  const data = await res.json()
  const posts: Post[] = data.posts

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-orange-500">
            AniManga
          </h1>

          <p className="text-gray-600 mt-2">
            アニメ・漫画レビューサービス
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-gray-500">投稿がまだありません</p>
        ) : (
          posts.map((post) => (
            <Link href={`posts/${post.id}`} key={post.id} >
              <PostCard key={post.id} post={post} />
            </Link>
          ))
        )}
      </div>
    </div>
  )
}