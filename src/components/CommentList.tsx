import CommentItem from "@/components/CommentItem"

type Comment = {
  id: number
  userId: number
  content: string
  createdAt: Date
  user: {
    name: string
    username: string
  }
}

type Props = {
  comments: Comment[]
  postId: number
  currentUserId: number | null
}

export default function CommentList({
  comments,
  postId,
  currentUserId,
}: Props) {
  if (comments.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-500">
        まだコメントがありません。
      </p>
    )
  }

  return (
    <div className="mt-6 space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          postId={postId}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}