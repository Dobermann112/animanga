"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

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
      className="mt-2 text-sm text-yellow-500"
    >
      {isBookmarked ? "⭐️" : "⭐︎"} {bookmarkCount}
    </button>
  )
}