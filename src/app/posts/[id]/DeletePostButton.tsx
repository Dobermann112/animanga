"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

type Props = {
  postId: number
}

export default function DeletePostButton({ postId }: Props) {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    const confirmed = window.confirm("本当に削除しますか？")

    if (!confirmed) {
      return
    }

    setLoading(true)

    const res = await fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      alert("削除に失敗しました")
      setLoading(false)
      return
    }

    setLoading(false)
    router.push("/")
  }

  return (
    <>
      <button
        type="button"
        disabled={loading}
        className="inline-block bg-red-600 hover:bg-red-800 text-white px-4 py-1 rounded transition"
        onClick={handleDelete}
      >
        { loading ? "削除中..." : "削除する" }
      </button>
    </>
  )
}