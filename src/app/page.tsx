import PostCard from "@/components/PostCard"
import type { Post } from "@/types/post"

const posts: Post[] = [
  {
    id: "1",
    title: "進撃の巨人",
    image_url: "https://via.placeholder.com/400x200",
    comment: "作画とストーリーが神",
    rating: 5,
    review_target: "anime",
  },
  {
    id: "2",
    title: "鬼滅の刃",
    image_url: "https://via.placeholder.com/400x200",
    comment: "演出が最高",
    rating: 4,
    review_target: "both",
  },
  {
    id: "3",
    title: "ワンピース",
    image_url: "https://via.placeholder.com/400x200",
    comment: "長いけど面白い",
    rating: 5,
    review_target: "manga",
  },
]

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-xl mx-auto px-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  )
}