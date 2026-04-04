import PostCard from "@/components/PostCard";
import { Post } from "@/types/post"

const posts: Post[] = [
  {
    id: "1",
    title: "進撃の巨人",
    image_url: "",
    comment: "作画が神",
    rating: 5,
    review_target: "anime",
  },
]

export default function Home() {
  return (
  <div className="p-4 border rounded mb-4 bg-white text-black">
    {posts.map((post) => (
      <PostCard key={post.id} post={post} />
    ))}
  </div>
)
}