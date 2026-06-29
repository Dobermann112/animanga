import CommentDeleteButton from "./CommentDeleteButton";
import UserLink from "./UserLink";

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
  comment: Comment
  postId: number
  currentUserId: number | null
}

export default function CommentItem({
  comment,
  postId,
  currentUserId,
}: Props) {
  const isOwner = comment.userId === currentUserId

  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-start justify-between">
        <div>
          <UserLink
            username={comment.user.username}
            name={comment.user.name}
            variant="text"
          />

          <p className="text-xs text-gray-500">
            {comment.createdAt.toLocaleDateString("ja-JP")}
          </p>
        </div>

        {isOwner && (
          <CommentDeleteButton
            postId={postId}
            commentId={comment.id}
          />
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-gray-700">
        {comment.content}
      </p>
    </div>
  )
}