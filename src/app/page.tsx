import PostCard from "@/components/PostCard"
import type { Post } from "@/types/post"

export default async function Home() {
  const res = await fetch("http://localhost:3001/api/posts", {
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
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">投稿がまだありません</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}