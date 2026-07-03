"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  username: string
  initialIsFollowing: boolean
}

export default function FollowButton({ username, initialIsFollowing }: Props) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const res = await fetch(`/api/users/${username}/follow`, {
        method: isFollowing ? "DELETE" : "POST",
      })

      if (!res.ok) return

      setIsFollowing((prev) => !prev)
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
      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition disabled:opacity-50 ${
        isFollowing
          ? "border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:text-red-500"
          : "border-gray-900 bg-gray-900 text-white hover:bg-gray-700"
      }`}
    >
      {isFollowing ? "フォロー中" : "フォロー"}
    </button>
  )
}
