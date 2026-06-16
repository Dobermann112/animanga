"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type CommentFormProps = {
  postId: number
}

export default function CommentForm({ postId }: CommentFormProps) {
  const router = useRouter()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!content.trim()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create comment")
      }

      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Error", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="コメントを入力..."
        className="min-h-24 w-full resize-none rounded-xl border border-gray-300 p-3 text-sm text-gray-900 outline-none focus:border-gray-500"
      />

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          disabled={isLoading || !content.trim()}
          className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {isLoading ? "送信中..." : "コメントする"}
        </button>
      </div>
    </form>
  )
}