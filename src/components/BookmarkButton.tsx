"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { Bookmark } from "lucide-react"

type Props = {
  postId: number
  initialBookmarked: boolean
  initialBookmarkCount: number
}

export default function BookmarkButton({
  postId,
  initialBookmarked,
  initialBookmarkCount,
}: Props) {
  const router = useRouter()

  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading) return

    setIsLoading(true)

    try {
      const res = await fetch(`/api/posts/${postId}/bookmarks`, {
        method: isBookmarked ? "DELETE" : "POST",
      })

      if (!res.ok) {
        return
      }

      if (isBookmarked) {
        setIsBookmarked(false)
        setBookmarkCount((prev) => prev - 1)
      } else {
        setIsBookmarked(true)
        setBookmarkCount((prev) => prev + 1)
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
        isBookmarked ? "text-yellow-500" : "text-gray-600"
      }`}
    >
      <Bookmark
        size={18}
        fill={isBookmarked ? "currentColor" : "none"}
      />
      <span className="leading-none">{bookmarkCount}</span>
    </button>
  )
}