import type { Post } from "@/types/post"

type Props = {
  post: Post
}

export default function PostCard({ post }: Props) {
  const renderTags = () => {
    if (post.review_target === "anime") return "[アニメ]"
    if (post.review_target === "manga") return "[漫画]"
    return "[漫画][アニメ]"
  }
  return (
    <div>
      <p>{renderTags()}</p>
      <p>{post.title}</p>
      <p>{"★".repeat(post.rating)}</p>
      <p>{post.comment}</p>
    </div>
  )
}