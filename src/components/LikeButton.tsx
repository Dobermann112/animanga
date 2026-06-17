"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Heart } from "lucide-react"

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
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
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
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className={`inline-flex items-center gap-1 text-sm transition disabled:opacity-50 ${
        isLiked ? "text-red-500" : "text-gray-600"
      }`}
    >
      <Heart
        size={18}
        fill={isLiked ? "currentColor" : "none"}
      />
      <span className="leading-none">{likeCount}</span>
    </button>
  )
}