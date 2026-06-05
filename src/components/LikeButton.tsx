"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  postId: number
  initialLiked: boolean
  initialLikeCount: number
}

export default function LikeButton({
  postId,
  initialLiked,
  initialLikeCount,
}: Props) {
  const router = useRouter()

  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)

  const handleClick = async () => {
    const res = await fetch(`/api/posts/${postId}/likes`, {
      method: isLiked ? "DELETE" : "POST",
    })

    if (!res.ok) {
      return
    }

    if (isLiked) {
      setIsLiked(false)
      setLikeCount((prev) => prev - 1)
    } else {
      setIsLiked(true)
      setLikeCount((prev) => prev + 1)
    }

    router.refresh()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="mt-2 text-sm text-gray-500"
    >
      {isLiked ? "❤️" : "🤍"} {likeCount}
    </button>
  )
}