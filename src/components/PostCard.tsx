import type { Post } from "@/types/post"

type Props = {
  post: Post
}

export default function PostCard({ post }: Props) {
  const renderTags = () => {
    if (post.review_target === "anime") {
      return <span className="text-xs border rounded px-2 py-1 mr-2">[アニメ]</span>
    }
    if (post.review_target === "manga") {
      return <span className="text-xs border rounded px-2 py-1 mr-2">[漫画]</span> 
    }
    return (
      <>
       <span className="text-xs border rounded px-2 py-1 mr-2">[漫画]</span>
       <span className="text-xs border rounded px-2 py-1 mr-2">[アニメ]</span>
      </>
    )
  }

  return (
    <div className="p-4 border rounded mb-4 bg-white text-black">
      <div>{renderTags()}</div>
      <p className="font-bold text-lg mt-2">{post.title}</p>
      <p className="mt-1">{"★".repeat(post.rating)}</p>
      <p className="mt-2">{post.comment}</p>
    </div>
  )
}