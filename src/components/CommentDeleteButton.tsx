"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

type CommentDeleteButtonProps = {
  postId: number
  commentId: number
}

export default function CommentDeleteButton({ postId, commentId,}: CommentDeleteButtonProps) {
  const router = useRouter()

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "コメントを削除しますか？"
    )

    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          commentId,
        }),
      })

      if (!response.ok) {
        throw new Error("Delete failed")
      }

      router.refresh()
    } catch (error) {
      console.error("Error", error)
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="flex h-7 w-7 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-700"
    >
      <Trash2 size={14} />
  
    </button>
  )
}